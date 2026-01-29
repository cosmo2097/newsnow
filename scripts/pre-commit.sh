#!/bin/sh

# Fix for GUI clients that don't load .zshrc/.bashrc where node is usually added to PATH
if ! command -v node >/dev/null 2>&1; then
    # Try to load NVM
    export NVM_DIR="$HOME/.nvm"
    if [ -s "$NVM_DIR/nvm.sh" ]; then
        . "$NVM_DIR/nvm.sh"
    fi
    
    # Fallback: check generic paths
    export PATH="$PATH:/usr/local/bin:/opt/homebrew/bin"
    
    # Last resort: try to find latest node in nvm dir manually
    if ! command -v node >/dev/null 2>&1 && [ -d "$HOME/.nvm/versions/node" ]; then
         LATEST_NODE=$(ls -td "$HOME/.nvm/versions/node"/v* 2>/dev/null | head -n 1)
         if [ -n "$LATEST_NODE" ]; then
             export PATH="$PATH:$LATEST_NODE/bin"
         fi
    fi
fi

# Run lint-staged
./node_modules/.bin/lint-staged
