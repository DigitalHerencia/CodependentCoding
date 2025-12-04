# CLI Hint System

The `lv hint` command provides contextual help based on your current project state.

## Hint Categories

### DevCycle Hints

Suggestions based on current DevCycle state and next steps.

### Error Hints

Help for resolving the most recent error.

### Context Hints

Tips based on files you're working with.

## Usage

```bash
# Get contextual hints based on current state
lv hint

# Get help with the last error
lv hint error

# Get DevCycle suggestions
lv hint devcycle

# Get hints for what to do next
lv hint next

# Detailed explanations
lv hint --detailed
```

## Hint Sources

1. **State Analysis**: Reads `.loaded-vibes/state.json`
2. **Git Status**: Checks uncommitted changes
3. **Error Logs**: Parses recent error entries
4. **File Context**: Analyzes recently modified files
