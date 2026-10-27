export const GAME_URL='https://liurunjia629-bit.github.io/The-Loony-Bin-Lab/';
export function parseInvite(search:string):number|null{const raw=new URLSearchParams(search).get('friend');return raw!==null&&/^\d{1,2}$/.test(raw)&&Number(raw)<12?Number(raw):null}
export function inviteUrl(id:number){const url=new URL(GAME_URL);url.searchParams.set('friend',String(id));return url.href}
