import json
import os
import subprocess
import shutil

# No need to include the 'v' in front
VERSION = "0.9.9"
MIN_ENGINE_VERSION = [ 1, 21, 70 ]

CONSTANTS_TS_PATH = "src/constants.ts"
CONSTANTS_JS_PATH = "scripts/constants.js"
TEMP_CONSTANTS_TS_PATH = "src/constants_temp.ts"
TEMP_CONSTANTS_JS_PATH = "scripts/constants_temp.js"

SCRIPTS_PATH = "scripts"

BP_PATH = "BP"
RP_PATH = "RP"
BP_SCRIPTS_PATH = "BP/scripts"
MAIN_MANIFEST_PATH = "main-manifest.json"
BP_MANIFEST_PATH = "BP/manifest.json"
RP_MANIFEST_PATH = "RP/manifest.json"

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
    # This deletes the entire BP/scripts folder
    if os.path.exists(BP_SCRIPTS_PATH):
        try:
            shutil.rmtree(BP_SCRIPTS_PATH)
            print(f"Deleted existing folder: {BP_SCRIPTS_PATH}")
        except Exception as e:
            print(f"Error deleting folder: {e}")

    if not os.path.exists("BP"):
        os.makedirs("BP")

    # Move the 'scripts' folder to the BP directory
    try:
        shutil.move(SCRIPTS_PATH, BP_SCRIPTS_PATH)
        print(f"Moved {SCRIPTS_PATH} to {BP_SCRIPTS_PATH}")
    except Exception as e:
        print(f"Error moving folder: {e}")

def build_project():
    # Inject version into constants.ts (into a temporary file)
    inject_to_src()

    # Compile TypeScript
    compile_typescript()

    # Rename the compiled file to constants.js
    rename_output_file()

    move_scripts()

    # Clean up the temporary constants file
    clean_up()


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

build_manifest()

# build_project()
