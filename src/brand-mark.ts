export const BRAND_NAME='不正常人类研究所';
export const BRAND_ENGLISH='THE LOONY BIN LAB.';
// One shared drawing for the React mark and favicon. The final stroke leaves the seal.
export const brandPaths={
 seal:'M31 5C46 3 57 13 58 28C61 43 50 57 35 59C19 61 7 51 5 36C2 21 14 7 31 5Z',
 top:'M18 21Q31 18 45 19',
 sweep:'M36 20Q30 31 18 39',
 stem:'M33 29Q32 39 32 48',
 rebel:'M41 31Q49 35 59 43',
};
export function brandSvg(size=64,mode:'light'|'dark'='light'){
 const ink=mode==='dark'?'#F8F5EF':'#242424',paper=mode==='dark'?'#242424':'#F8F5EF';
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}"><path d="${brandPaths.seal}" fill="${ink}"/><path d="${brandPaths.rebel}" fill="none" stroke="${ink}" stroke-width="9" stroke-linecap="round"/><g fill="none" stroke="${paper}" stroke-width="4.8" stroke-linecap="round" stroke-linejoin="round">${[brandPaths.top,brandPaths.sweep,brandPaths.stem,brandPaths.rebel].map(d=>`<path d="${d}"/>`).join('')}</g></svg>`;
}
