export const truncateWallet = (
  wallet: string, 
  startLength: number = 6, 
  endLength: number = 4
): string => {
  if (!wallet) return '';
  
  const start = wallet.substring(0, startLength);
  const end = wallet.substring(wallet.length - endLength);
  
  return `${start}...${end}`;
};

export const shuffleArray = (array: any[]): any[] => {
  let currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
  }

  return array;
}
