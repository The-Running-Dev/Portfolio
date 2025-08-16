# Update the submodule to the latest version
git submodule update --remote template

# Initialize submodules when cloning the repo (for others)
git submodule update --init --recursive

# Check submodule status
git submodule status

# Navigate to the template folder to work with template files
cd template