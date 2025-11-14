#!/bin/bash

# Add shebangs to all compiled JS files in dist/

echo "Adding shebangs to compiled files..."

for file in dist/*.js; do
    if ! head -1 "$file" | grep -q "^#!"; then
        echo "#!/usr/bin/env node" | cat - "$file" > temp && mv temp "$file"
        chmod +x "$file"
        echo "✓ Added shebang to $file"
    else
        echo "✓ Shebang already present in $file"
    fi
done

echo "Done!"
