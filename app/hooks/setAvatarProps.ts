

function stringToColor(string: string) {
    let hash = 0;
    let i;
  
    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    let color = '#';
  
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */
  
    return color;
}

export function setAvatarProps(name: string) {
    let letters;
    if(!!!name)
      return {
    sx: {
      bgcolor: stringToColor("NA"),
      width: 60,
      height: 60,
      fontSize: 30,
    },
    children: "NA",
  };
    let fixedName = name.trim().replace(/\s+/g, ' ');
    if(fixedName.split(' ').length > 1)
      letters = `${fixedName.split(' ')[0][0]}${fixedName.split(' ')[1][0]}`.toUpperCase();
    else if(fixedName.split('').length > 2)
      letters = `${fixedName.split('')[0][0]}${fixedName.split('')[2][0]}`.toUpperCase();
    else 
      letters = fixedName[0][0];
    return {
        sx: {
            bgcolor: stringToColor(name),
            width: 40,
            height: 40,
            fontSize: 20,
        },
        children: letters,
    };
}
  