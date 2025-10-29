# Testing Shot Breakdown Fixes

## What Was Fixed

### Issue: "Ahora no se ve nada en el Generador de Escenas"

The script format had variations that weren't being detected:
- Title: `**Prompt Completo Optimizado para Sora 2 (Texto Continuo)**`
- Markers: `[Cut]` with capital C instead of lowercase `[cut]`

### Changes Made (Commit: 96accd2)

1. **Multiple Title Pattern Support**
   - Now supports: `**Prompt para Sora 2:**`
   - Now supports: `**Prompt Completo para Sora 2:**`
   - Now supports: `**Prompt Completo Optimizado para Sora 2 (Texto Continuo)**`
   - All variations with or without colons

2. **Case-Insensitive [cut] Detection**
   - Before: Only detected lowercase `[cut]`
   - Now: Detects `[cut]`, `[Cut]`, `[CUT]`, etc.
   - Regex: `/\[cut\]/gi`

3. **Extensive Debugging Logs**
   - Shows which pattern matched
   - Shows prompt section length
   - Shows number of characters detected
   - Shows number of shots found
   - Shows error reasons when parsing fails

## How to Test

### Step 1: Reload the Page
1. Open the app at http://localhost:5177
2. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
3. Open browser console (F12 → Console tab)

### Step 2: Test with Existing Script
1. Navigate to "Generador de Escenas"
2. Select the problematic script that wasn't showing scenes
3. Look for console logs starting with these emojis:
   - ✅ = Success
   - 📝 = Parsing info
   - 👥 = Characters detected
   - 🎬 = Shots found
   - ❌ = Errors

### Step 3: Share Console Logs
If still not working, share the console output. Look for:
```
✅ Found Sora section with pattern: ...
📝 Sora Prompt Section Length: ...
👥 Detected characters: ...
🎬 Shots found: ...
```

Or error messages:
```
❌ No se encontró la sección de prompt para Sora 2
Script preview: ...
```

### Step 4: Test with New Script
1. Go to Pipeline
2. Generate a new script (will use enforced format)
3. Check if it automatically shows breakdown
4. New scripts should always have lowercase `[cut]` markers

## Expected Results

### For Old Scripts with `[Cut]` markers:
- Should now parse correctly
- Should show all scenes
- Should detect characters

### For New Scripts:
- Will have standardized format: `**Prompt para Sora 2:**`
- Will have lowercase `[cut]` markers
- Should parse automatically on generation

## Troubleshooting

### If still not working:
1. Copy the entire script text
2. Check the console for specific error messages
3. Look at the "Script preview" in console to see what format is being seen
4. Share the console output for further diagnosis

### Common Issues:
- **No title found**: Check if script has any "Prompt para Sora" section
- **No [cut] markers**: Check if scenes are separated by some other marker
- **Only 1 scene**: Check if [cut] appears in the script text

## Format Examples

### Correct Format (enforced in new scripts):
```
**Prompt para Sora 2:**

[Scene 1 description here]

[cut]

[Scene 2 description here]

[cut]

[Scene 3 description here]
```

### Also Supported (legacy):
```
**Prompt Completo Optimizado para Sora 2 (Texto Continuo)**

[Scene 1 description here]

[Cut]

[Scene 2 description here]

[Cut]

[Scene 3 description here]
```

## Next Steps After Testing

1. If working: Great! All scripts should now parse correctly
2. If not working: Share console logs to diagnose
3. Consider: Regenerating old scripts with new format if needed
