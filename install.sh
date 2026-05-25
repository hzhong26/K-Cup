#!/usr/bin/env bash
# Installs the `play k cup` shell shortcut into your zsh/bash config.
# Re-running this script is safe — it replaces any previous block it added.

set -e

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

case "$(basename "${SHELL:-}")" in
    zsh)  RC_FILE="$HOME/.zshrc" ;;
    bash) RC_FILE="$HOME/.bashrc" ;;
    *)
        echo "Unsupported shell: ${SHELL:-unknown}"
        echo "Add the function from the README to your shell config manually."
        exit 1
        ;;
esac

touch "$RC_FILE"

BEGIN="# >>> k-cup play function >>>"
END="# <<< k-cup play function <<<"

if grep -qF "$BEGIN" "$RC_FILE"; then
    sed -i.bak "/$BEGIN/,/$END/d" "$RC_FILE"
    rm -f "$RC_FILE.bak"
    echo "Removed previous play() function block."
fi

cat >> "$RC_FILE" <<EOF

$BEGIN
play() {
    local game
    game="\$(echo "\$*" | tr '[:upper:]' '[:lower:]')"
    case "\$game" in
        "k cup"|"kcup"|"kings cup"|"k-cup")
            local dir="$REPO_DIR"
            if [ ! -d "\$dir/node_modules" ]; then
                echo "Installing dependencies (first run)..."
                ( cd "\$dir" && npm install ) || return 1
            fi
            (
                sleep 2
                if command -v open >/dev/null 2>&1; then
                    open "http://localhost:3000"
                elif command -v xdg-open >/dev/null 2>&1; then
                    xdg-open "http://localhost:3000"
                fi
            ) &
            ( cd "\$dir" && npm run dev )
            ;;
        "")
            echo "Usage: play <game>"
            echo "Available: play k cup"
            ;;
        *)
            echo "Unknown game: \$*"
            echo "Available: play k cup"
            ;;
    esac
}
$END
EOF

echo "Installed 'play' command into $RC_FILE"
echo "Repo path baked in: $REPO_DIR"
echo
echo "Open a new terminal (or run: source $RC_FILE), then type:"
echo "    play k cup"
