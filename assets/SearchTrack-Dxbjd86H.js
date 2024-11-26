import{r as o,d as M,s as j,f as I,w as P,a as W,g as y,i,j as z,k as J,l as e,v as d,q as T,m as U,u as b,F as G,t as K,y as O,C as Q,A as X,n as C,J as Y,x as g,H as Z}from"./index-B3SlTKs7.js";import{u as ee,L as ae,a as se}from"./LoadingEffect-CVVSGwC_.js";import{u as te}from"./musicPlayer-DBOyZfDV.js";import{P as oe}from"./vuejs-paginate-next.es-B0vSiDjn.js";import{H as le,F as ne}from"./FooterView-CS8J6Q0Z.js";import{P as re}from"./PlayTrackMusic-so9ShwAA.js";const ce={class:"wrapper"},ie={class:"container"},ue={class:"d-flex justify-content-between align-items-center flex-sm-row flex-column"},me={class:"fs-lg-2 fs-3 my-lg-8 my-sm-6 my-4"},de={class:"text-warning"},ge={class:"row row-cols-lg-2 row-cols-1 list-search gy-3 ps-0 mb-lg-8 mb-6"},fe={class:"search-single-info d-flex align-items-center"},ve=["src","alt"],pe={class:"ms-lg-4 ms-2"},ke={class:"single-name fs-6 mb-1"},ye={class:"singer-name fs-7"},be=["onClick"],he='<i class="bi bi-caret-left-fill"></i>',_e='<i class="bi bi-caret-right-fill"></i>',Re={__name:"SearchTrack",setup(we){const q=ee(),{getConfigAuthToken:L}=q,h=o({}),l=o({isLoading:!1,fullPage:!0,bgColor:"rgba(0,0,0,0.9)"}),R=M(()=>({active:l.value.isLoading,fullPage:l.value.fullPage,...l.value.bgColor&&{backgroundColor:l.value.bgColor}})),V=()=>{l.value.isLoading=!0},B=()=>{l.value.isLoading=!1},f=o({tracks:{data:[]}}),n=X(),E=Z(),_=te(),{singleRankData:u,isMusicPlaying:v}=j(_),{resetMusicTrackData:N}=_,m=o(null),S=t=>{u.value.id!==t&&(v.value&&m.value.closeMusicModal(),u.value.id=t,u.value.autoplay=!0,v.value=!0,C(()=>{setTimeout(()=>{m.value.showMusicModal()},300)}))},$=()=>{N()},D=()=>{v.value&&m.value.closeMusicModal()};I(()=>{D()});const w=o(0),r=o(Number(n.query.page)||1),p=o(24),F=M(()=>Math.ceil(w.value/p.value)),H=t=>{r.value=t,E.push({query:{...n.query,page:t}}),C(()=>{const a=document.activeElement;a&&a.tagName==="A"&&a.blur()})};P(r,()=>{x(c.value),A()}),P(()=>n.query.page,t=>{r.value=Number(t)||1});const A=()=>{window.scrollTo({top:0,behavior:"smooth"})},c=o(""),x=t=>{V();const a=(r.value-1)*p.value,k=p.value;se.get(`https://api.kkbox.com/v1.1/search?q=${t}&territory=TW&type=artist,track,album,playlist&limit=${k}&offset=${a} `,h.value).then(s=>{f.value.tracks.data=s.data.tracks.data,w.value=s.data.tracks.summary.total,B()})};return W(async()=>{h.value=await L(),n.query.q&&(c.value=n.query.q,x(c.value))}),(t,a)=>{const k=Y("RouterLink");return g(),y("div",ce,[i(ae,z(J(R.value)),null,16),i(le),e("main",null,[e("section",null,[e("div",ie,[e("div",ue,[e("h2",me,[e("strong",de,d(c.value),1),a[1]||(a[1]=T(" 單曲搜尋結果 "))]),i(k,{class:"btn-more-content mb-4 mb-sm-0",to:{name:"search",query:{q:b(n).query.q}}},{default:U(()=>[T(" 回到 "+d(c.value)+" 搜尋頁 ",1),a[2]||(a[2]=e("i",{class:"bi bi-arrow-left-circle"},null,-1))]),_:1},8,["to"])]),e("ul",ge,[(g(!0),y(G,null,K(f.value.tracks.data,s=>(g(),y("li",{class:"col list-search-item d-flex align-items-center",key:s.id},[e("div",fe,[e("img",{src:s.album.images[0].url,alt:s.name},null,8,ve),e("div",pe,[e("h4",ke,d(s.name),1),e("h6",ye,d(s.album.artist.name),1)])]),e("button",{type:"button",class:"btn btn-custom-play ms-auto",onClick:xe=>S(s.id)},a[3]||(a[3]=[e("i",{class:"bi bi-play-fill"},null,-1)]),8,be)]))),128))]),f.value.tracks.data.length!==0?(g(),O(b(oe),{key:0,"page-count":F.value,"page-range":3,"margin-pages":2,"click-handler":H,"prev-text":he,"next-text":_e,"container-class":"pagination",class:"py-lg-8 py-6 overflow-x-auto",modelValue:r.value,"onUpdate:modelValue":a[0]||(a[0]=s=>r.value=s)},null,8,["page-count","modelValue"])):Q("",!0)])]),i(re,{ref_key:"musicTrackModalRef",ref:m,"single-rank-data":b(u),onEmitCloseTrackMusicModal:$},null,8,["single-rank-data"])]),i(ne)])}}};export{Re as default};
