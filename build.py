import json
import os
import subprocess
import shutil
import zipfile

# No need to include the 'v' in front
# Only change version count here and as github tag
VERSION = "0.10.1"
MIN_ENGINE_VERSION = [ 1, 21, 70 ]

CONSTANTS_TS_PATH = "src/constants.ts"
CONSTANTS_JS_PATH = "scripts/constants.js"
TEMP_CONSTANTS_TS_PATH = "src/constants_temp.ts"
TEMP_CONSTANTS_JS_PATH = "scripts/constants_temp.js"

SCRIPTS_PATH = "scripts"

BP_PATH = "build/Extended Commands Suite BP"
RP_PATH = "build/Extended Commands Suite RP"
BP_SCRIPTS_PATH = "build/Extended Commands Suite BP/scripts"
MAIN_MANIFEST_PATH = "main-manifest.json"
BP_MANIFEST_PATH = "build/Extended Commands Suite BP/manifest.json"
RP_MANIFEST_PATH = "build/Extended Commands Suite RP/manifest.json"

OUTPUT_FILE = f"build/extended-commands-suite.mcaddon"
OUTPUT_FILE_BP = f"build/extended-commands-suite-bp.mcpack"
OUTPUT_FILE_RP = f"build/extended-commands-suite-rp.mcpack"

# Injects the version number into constants.ts
def inject_to_src():
    # Read the constants.ts file
    with open(CONSTANTS_TS_PATH, "r") as constants_file:
        content = constants_file.read()
    
    # Replace placeholder with the actual version number
    new_content = content.replace("{{VERSION}}", VERSION)
    
    # Write the modified content back to the constants.ts file
    with open(TEMP_CONSTANTS_TS_PATH, "w") as temp_constants_file:
        temp_constants_file.write(new_content)
    print(f"Injected version into {TEMP_CONSTANTS_TS_PATH}")



def compile_typescript():
    print("Compiling TypeScript files...")
    # Run the TypeScript compiler
    result = subprocess.run(["tsc"], capture_output=True, text=True)
    if result.returncode != 0:
        print("Error compiling TypeScript:")
        print(result.stderr)
    else:
        print("TypeScript compilation completed successfully.")

# Function to rename the compiled file to constants.js
def rename_output_file():
    if os.path.exists(TEMP_CONSTANTS_JS_PATH):
        os.rename(TEMP_CONSTANTS_JS_PATH, CONSTANTS_JS_PATH)
        print(f"Renamed {TEMP_CONSTANTS_JS_PATH} to {CONSTANTS_JS_PATH}")
    else:
        print(f"Error: {TEMP_CONSTANTS_JS_PATH} does not exist.")

def clean_up():
    if os.path.exists(TEMP_CONSTANTS_TS_PATH):
        os.remove(TEMP_CONSTANTS_TS_PATH)
        print(f"Cleaned up temporary file: {TEMP_CONSTANTS_TS_PATH}")
    else:
        print("No temporary constants file to clean up.")

def move_scripts():
    # This deletes the entire BP/scripts directory
    if os.path.exists(BP_SCRIPTS_PATH):
        try:
            shutil.rmtree(BP_SCRIPTS_PATH)
            print(f"Deleted existing folder: {BP_SCRIPTS_PATH}")
        except Exception as e:
            print(f"Error deleting folder: {e}")

    if not os.path.exists(BP_PATH):
        os.makedirs(BP_PATH)

    # Move the 'scripts' folder to the BP directory
    try:
        shutil.move(SCRIPTS_PATH, BP_SCRIPTS_PATH)
        print(f"Moved {SCRIPTS_PATH} to {BP_SCRIPTS_PATH}")
    except Exception as e:
        print(f"Error moving folder: {e}")

def copy_misc_files():
    shutil.copy("LICENCE", f'{BP_PATH}/LICENCE')
    shutil.copy("LICENCE", f'{RP_PATH}/LICENCE')
    shutil.copy("pack_icon.png", f'{BP_PATH}/pack_icon.png')
    shutil.copy("pack_icon.png", f'{RP_PATH}/pack_icon.png')
    shutil.copy("./language/languages.json", f'{BP_PATH}/texts/languages.json')
    shutil.copy("./language/languages.json", f'{RP_PATH}/texts/languages.json')
    shutil.copytree('functions', f'{BP_PATH}/functions')
    # Doesn't seem to show entities anyway, just use the supplementary pack
    shutil.copytree('bp-entities', f'{BP_PATH}/entities')
    # shutil.copytree('language', f'{RP_PATH}/texts')
    # shutil.copytree('rp-entities', f'{RP_PATH}/entity')

def split_lang_files(language_dir, bp_path, rp_path):

    # Loop through all .lang files in the language directory
    for filename in os.listdir(language_dir):
        if filename.endswith(".lang"):
            lang_code = filename.split('.')[0]
            input_file = os.path.join(language_dir, filename)
            bp_file_path = os.path.join(bp_path, "texts", filename)
            rp_file_path = os.path.join(rp_path, "texts", filename)

            with open(input_file, "r", encoding="utf-8") as infile, \
                 open(bp_file_path, "w", encoding="utf-8") as bp_file, \
                 open(rp_file_path, "w", encoding="utf-8") as rp_file:

                for line in infile:
                    stripped_line = line.strip()
                    if not stripped_line:
                        continue  # Skip empty lines

                    if "=" in stripped_line:
                        key_part, value_part = stripped_line.split("=", 1)
                        key_part = key_part.strip()
                        value_part = value_part.lstrip()

                        if key_part.startswith("bp."):
                            shortened_key = key_part[3:]  # Remove the "bp." prefix
                            bp_file.write(f"{shortened_key}={value_part}\n")
                        elif key_part.startswith("rp."):
                            shortened_key = key_part[3:]  # Remove the "rp." prefix
                            rp_file.write(f"{shortened_key}={value_part}\n")

            print(f"Processed {filename}")

def build_manifest():
    # Load the original JSON file
    with open(MAIN_MANIFEST_PATH, 'r') as file:
        data = json.load(file)

    # Update the version in the original data
    data["header"]["version"] = VERSION

    def update_dependencies(dependencies, new_version):
        updated = []
        for dep in dependencies:
            # Check if the dependency has a version array (e.g., [0, 0, 0])
            if isinstance(dep.get("version"), list):
                updated_dep = {**dep, "version": new_version}
            else:
                updated_dep = dep
            updated.append(updated_dep)
        return updated

    # Extract the behavior pack data
    bp_data = {
        "format_version": data["format_version"],
        "metadata": data["metadata"],
        "header": {
            "description": data["header"]["bp_description"],
            "name": data["header"]["bp_name"],
            "uuid": data["header"]["bp_uuid"],
            "version": VERSION,  # Use the version parameter here
            "min_engine_version": MIN_ENGINE_VERSION
        },
        "modules": data["bp_modules"],
        "dependencies": update_dependencies(data["bp_dependencies"], VERSION)
    }

    # Extract the resource pack data
    rp_data = {
        "format_version": data["format_version"],
        "metadata": data["metadata"],
        "header": {
            "description": data["header"]["rp_description"],
            "name": data["header"]["rp_name"],
            "uuid": data["header"]["rp_uuid"],
            "version": VERSION,  # Use the version parameter here
            "min_engine_version": MIN_ENGINE_VERSION
        },
        "modules": data["rp_modules"],
        "dependencies": update_dependencies(data["rp_dependencies"], VERSION)
    }

    # Write the behavior pack JSON file
    with open(BP_MANIFEST_PATH, 'w') as bp_file:
        json.dump(bp_data, bp_file, indent=4)

    # Write the resource pack JSON file
    with open(RP_MANIFEST_PATH, 'w') as rp_file:
        json.dump(rp_data, rp_file, indent=4)

    print(f"Successfully split the manifest file into BP/manifest.json and RP/manifest.json with version {VERSION}.")

def prepare_directories():

    # Remove directories and files first
    if os.path.exists(OUTPUT_FILE):
        os.remove(OUTPUT_FILE)

    if os.path.exists(BP_PATH):
        shutil.rmtree(BP_PATH)

    if os.path.exists(RP_PATH):
        shutil.rmtree(RP_PATH)

    # Now create them
    if not os.path.exists(BP_PATH):
        os.makedirs(BP_PATH)
        os.makedirs(f'{BP_PATH}/texts')
    
    if not os.path.exists(RP_PATH):
        os.makedirs(RP_PATH)
        os.makedirs(f'{RP_PATH}/texts')

def create_mcaddon(bp_path, rp_path, output_file_1, output_file_2, output_file_3):
    with zipfile.ZipFile(output_file_1, 'w', zipfile.ZIP_DEFLATED) as mcaddon:
        # We don't need to use a resource pack just yet
        # The entities don't show up for /shoot
        # Add BP files
        for folder_name in [bp_path, rp_path]:
            for root, dirs, files in os.walk(folder_name):
                for file in files:
                    file_path = os.path.join(root, file)
                    # Write with relative path inside the zip
                    arcname = os.path.relpath(file_path, start=os.path.dirname(bp_path))
                    mcaddon.write(file_path, arcname)
                # Add BP files
    print(f"Created: {output_file_1}")
    with zipfile.ZipFile(output_file_2, 'w', zipfile.ZIP_DEFLATED) as mcpack_1:
        for root, dirs, files in os.walk(bp_path):
            for file in files:
                file_path = os.path.join(root, file)
                # Write with relative path inside the zip
                arcname = os.path.relpath(file_path, start=bp_path)
                mcpack_1.write(file_path, arcname)
    print(f"Created: {output_file_2}")
    with zipfile.ZipFile(output_file_3, 'w', zipfile.ZIP_DEFLATED) as mcpack_2:
        for root, dirs, files in os.walk(rp_path):
            for file in files:
                file_path = os.path.join(root, file)
                # Write with relative path inside the zip
                arcname = os.path.relpath(file_path, start=rp_path)
                mcpack_2.write(file_path, arcname)
    print(f"Created: {output_file_3}")

def build_project():

    # Ensure folders are there and deletes existing files
    prepare_directories()

    # Inject version into constants.ts (into a temporary file)
    inject_to_src()

    # Compile TypeScript
    compile_typescript()

    # Rename the compiled file to constants.js
    rename_output_file()

    move_scripts()

    build_manifest()

    copy_misc_files()

    split_lang_files("./language", BP_PATH, RP_PATH)

    create_mcaddon(BP_PATH, RP_PATH, OUTPUT_FILE, OUTPUT_FILE_BP, OUTPUT_FILE_RP)

    # Clean up the temporary constants file
    clean_up()

build_project()
