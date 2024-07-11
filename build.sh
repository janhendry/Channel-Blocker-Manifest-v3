#!/bin/bash

manifest_file="./manifest.json"
manifest_file_firefox="./manifest.json.firefox"
images_folder="./images"
ui_folder="./ui"

destination_folder="./dist"
destination_folder_firefox="./dist-firefox"

# Delete the existing dist folder
rm -rf "$destination_folder"
rm -rf "$destination_folder_firefox"

rm -rf ./ui/dist
rm -rf ./worker/dist
rm -rf ./content-scripts/dist
rm -rf ./core/dist

# Run npm run build in content-scripts folder
cd content-scripts
npm run build
cd ..

# Run npm run build in core folder
cd core
npm run build
cd ..

# Run npm run build in worker folder
cd worker
npm run build
cd ..

# Run npm run build in ui folder
cd ui
npm run build
cd ..

# Create the destination folder if it doesn't exist
mkdir -p "$destination_folder/images"
mkdir -p "$destination_folder/content-scripts"
mkdir -p "$destination_folder/worker"
mkdir -p "$destination_folder/ui"

# Copy the contents of the images folder
cp "$manifest_file" "$destination_folder"
cp -r "$images_folder"/* "$destination_folder/images"
# cp -r content-scripts/dist/* "$destination_folder/content-scripts"
cp -r worker/dist/* "$destination_folder/worker"
cp -r ui/dist/* "$destination_folder/ui"

# Copy HTML files from the ui folder and its subfolders
cp -r ui/src/settings/*.html "$destination_folder/ui/settings/"

# Create the zip file for Chrome
mkdir -p ./bin
cd "$destination_folder"
zip -r -q -FS ../bin/ytc.zip *
cd ..

# Create the zip file for Firefox
cp -r "$destination_folder" "$destination_folder_firefox"
cp "$manifest_file_firefox" "$destination_folder_firefox/manifest.json"
cd "$destination_folder_firefox"
zip -r -q -FS ../bin/ytc.xpi *