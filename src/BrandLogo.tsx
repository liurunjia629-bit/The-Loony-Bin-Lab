import {BRAND_NAME,BRAND_ENGLISH,brandPaths} from './brand-mark';
import './brand.css';

type BrandLogoProps={size?:number;mode?:'light'|'dark';iconOnly?:boolean};
export function BrandLogo({size=40,mode='light',iconOnly=false}:BrandLogoProps){
 const ink=mode==='dark'?'#F8F5EF':'#242424',paper=mode==='dark'?'#242424':'#F8F5EF';
 return <span className={`brand-logo brand-logo-${mode}`} style={{color:ink}}>
  <svg className="brand-logo-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} style={{width:size,height:size}} role={iconOnly?'img':undefined} aria-label={iconOnly?BRAND_NAME:undefined} aria-hidden={iconOnly?undefined:true} focusable="false">
   <path d={brandPaths.seal} fill={ink}/><path d={brandPaths.rebel} fill="none" stroke={ink} strokeWidth="9" strokeLinecap="round"/>
   <g fill="none" stroke={paper} strokeWidth="4.8" strokeLinecap="round" strokeLinejoin="round">{[brandPaths.top,brandPaths.sweep,brandPaths.stem,brandPaths.rebel].map(d=><path key={d} d={d}/>)}</g>
  </svg>
  {!iconOnly&&<span className="brand-logo-wordmark"><strong>{BRAND_NAME}</strong><small lang="en">{BRAND_ENGLISH}</small></span>}
 </span>;
}
