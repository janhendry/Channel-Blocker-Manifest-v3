class Observer {
    private target: string | Element;

    private observerOptions: ObserverOptions[];
    private subObserver: SubObserverOptions[];

    private activeMutationObserver: MutationObserver[] = [];
    private isBlockedValidators: Function[] = [];

    constructor(targetSelector: string | Element, observerOptions: ObserverOptions[], subObserver?: SubObserverOptions[]) {
        this.target = targetSelector;
        this.observerOptions = observerOptions;
        this.subObserver = subObserver ?? [];

        this.addObserver();
    }

    public disconnect() {
        while (this.activeMutationObserver.length > 0) {
            this.activeMutationObserver.pop()?.disconnect();
        }
    }

    public update() {
        console.log(`update ${this.isBlockedValidators.length} isBlockedValidators`);

        for (let index = 0; index < this.isBlockedValidators.length; index++) {
            this.isBlockedValidators[index]();
        }
    }

    private async addObserver() {
        const element: Element = typeof this.target === "string" ? await getElement(this.target) : this.target;
        console.log(`Observe: `, element);

        for (let index = 0; index < element.children.length; index++) {
            this.handleChild(element.children[index]);
        }

        const mainMutationObserver = new MutationObserver((mutationRecords: MutationRecord[]) => {
            for (let index = 0; index < mutationRecords.length; index++) {
                const mutationRecord = mutationRecords[index];
                if (mutationRecord.type === "childList") {
                    for (let index = 0; index < mutationRecord.addedNodes.length; index++) {
                        this.handleChild(mutationRecord.addedNodes[index] as Element);
                    }
                }
            }

            /*
            for (let index = 0; index < this.observerOptions.length; index++) {
                const observerOption = this.observerOptions[index];

                let addedElements = element.querySelectorAll(observerOption.anchorSelector);
                console.log("newVideoNodes: ", this.observedElements.length);
                let added = 0;
                for (let index = 0; index < addedElements.length; index++) {
                    const addedElement = addedElements[index];
                    if (!this.observedElements.includes(addedElement)) {
                        this.observedElements.push(addedElement);
                        this.addCharacterDataSelector(addedElement, observerOption);
                        added++;
                    }
                }
                if (added >= 0) console.log("videoNodes:", this.observedElements.length, "added:", added, this.observedElements);
            }
            */
        });

        mainMutationObserver.observe(element, { childList: true });
        this.activeMutationObserver.push(mainMutationObserver);
    }

    private handleChild(child: Element) {
        // Check for sub observer
        for (let index = 0; index < this.subObserver.length; index++) {
            const subObserver = this.subObserver[index];
            if (child.matches(subObserver.targetSelector)) {
                getElement(subObserver.anchorSelector, child).then((target: Element) => {
                    activeObserver.push(new Observer(target, subObserver.observerOptions ?? this.observerOptions, subObserver.subObserver));
                });
            }
        }

        for (let index = 0; index < this.observerOptions.length; index++) {
            const observerOption = this.observerOptions[index];
            if (child.matches(observerOption.anchorSelector)) {
                this.addCharacterDataSelector(child, observerOption);
            }
        }
    }

    private async addCharacterDataSelector(element: Element, observerOption: ObserverOptions) {
        let userChannelName: string | undefined;
        let videoTitle: string | undefined;
        let commentContent: string | undefined;

        const checkIfElementIsBlocked = async () => {
            const blocked = await isBlocked({ userChannelName, videoTitle, commentContent });

            element.classList.toggle("blocked", blocked);
        };
        this.isBlockedValidators.push(checkIfElementIsBlocked);

        element.querySelectorAll("button[class='cb_block_button']").forEach((blockButton) => {
            console.log(`remove block button`);

            blockButton.remove();
        });

        if (observerOption.userChannelName !== undefined) {
            const elementAndIndex = await getElementFromList(observerOption.userChannelName, element);
            const userChannelNameElement = elementAndIndex.element;
            let button = createBlockBtnElement("");
            button.addEventListener("click", (mouseEvent) => {
                mouseEvent.preventDefault();
                mouseEvent.stopPropagation();

                if (userChannelName !== undefined) {
                    blockUserChannel(userChannelName);
                }
            });

            if (observerOption.insertBlockBtn) {
                observerOption.insertBlockBtn[elementAndIndex.index](element as HTMLElement, userChannelNameElement as HTMLElement, button);
            } else {
                userChannelNameElement.insertAdjacentElement("beforebegin", button);
            }

            const handleUserChannelName = () => {
                userChannelName = userChannelNameElement.textContent ?? undefined;
                console.log("Changed Channel: " + userChannelName);
                button.setAttribute("title", "Block '" + userChannelName + "' (Channel Blocker)");
                checkIfElementIsBlocked();
            };
            const mutationObserver = new MutationObserver(handleUserChannelName);
            mutationObserver.observe(userChannelNameElement, { childList: true, subtree: true, characterData: true });
            this.activeMutationObserver.push(mutationObserver);
            handleUserChannelName();
        }

        if (observerOption.videoTitle !== undefined) {
            const elementAndIndex = await getElementFromList(observerOption.videoTitle, element);
            const videoTitleElement = elementAndIndex.element;
            const handleVideoTitle = () => {
                videoTitle = videoTitleElement.textContent ?? undefined;
                console.log("Changed Title: " + videoTitle);
                checkIfElementIsBlocked();
            };
            const mutationObserver = new MutationObserver(handleVideoTitle);
            mutationObserver.observe(videoTitleElement, { childList: true, subtree: true, characterData: true });
            this.activeMutationObserver.push(mutationObserver);
            handleVideoTitle();
        }
    }
}
