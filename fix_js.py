with open('docs/script.v2.js', 'r') as f:
    lines = f.readlines()
lines[1041] = '            card.innerHTML = \'<span class="kb-tag \' + tagClass + \'">\' + tagText + \'</span>\' +\n'
lines[1042] = '                \'<h3 style="margin-top:0; color:var(--accent-color);">\' + item.partName + \'</h3>\' +\n'
lines[1043] = '                \'<p>\' + item.notes + \'</p>\' +\n'
lines[1044] = '                \'<small style="color:var(--text-muted);">Applies to: \' + (item.compatibleVehicles || []).join(\', \') + \'</small>\';\n'
# Remove the extra lines
del lines[1045:1047]  # Remove the leftover corrupted lines
with open('docs/script.v2.js', 'w') as f:
    f.writelines(lines)