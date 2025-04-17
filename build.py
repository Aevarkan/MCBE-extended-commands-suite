import json
import os

VERSION = "0.9.9"

CONSTANTS_PATH = "src/constants.ts"
TEMP_CONSTANTS_TS_PATH = "src/constants_temp.ts"
TEMP_CONSTANTS_JS_PATH = "scripts/constants_temp.js"
CONSTANTS_JS_PATH = "scripts/constants.js"

MAIN_MANIFEST_PATH = "main-manifest.json"
BP_PATH = "BP"
RP_PATH = "RP"
BP_MANIFEST_PATH = "BP/manifest.json"
RP_MANIFEST_PATH = "RP/manifest.json"

# Injects the version number into constants.ts
def inject_to_src():
    # Read the constants.ts file
    with open(CONSTANTS_PATH, "r") as constants_file:
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
    if os.path.exists(TEMP_CONSTANTS_JS):
        os.rename(TEMP_CONSTANTS_JS, OUTPUT_JS_PATH)
        print(f"Renamed {TEMP_CONSTANTS_JS} to {OUTPUT_JS_PATH}")
    else:
        print(f"Error: {TEMP_CONSTANTS_JS} does not exist.")

def clean_up():
    if os.path.exists(TEMP_CONSTANTS_TS_PATH):
        os.remove(TEMP_CONSTANTS_TS_PATH)
        print(f"Cleaned up temporary file: {TEMP_CONSTANTS_TS_PATH}")
    else:
        print("No temporary constants file to clean up.")

# with open(MAIN_MANIFEST_PATH) as f:
#     full_manifest = json.load(f)
