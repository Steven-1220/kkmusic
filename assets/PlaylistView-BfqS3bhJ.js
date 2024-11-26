import{u as U,L as X,a as N}from"./LoadingEffect-CVVSGwC_.js";import{r as o,a as W,n as C,x as d,g as r,l as s,d as Y,s as Z,f as ss,i as p,j as ls,k as as,v as c,u as T,q as ts,F as es,t as os,A as is}from"./index-B3SlTKs7.js";import{u as cs}from"./tools-BaBLyt2A.js";import{u as ns}from"./musicPlayer-DBOyZfDV.js";import{_ as us,M as ds,H as rs,F as ms}from"./FooterView-CS8J6Q0Z.js";import{P as fs}from"./PlayTrackMusic-so9ShwAA.js";const ps={class:"modal-dialog modal-dialog-bottom"},ys={class:"modal-content"},vs={class:"modal-body d-flex justify-content-md-center"},gs=["src"],_s={key:1,class:"text-center"},bs={__name:"PlayPlaylist",props:{musicPlaylistData:Object},emits:["emitCloseMusicPlaylistModal"],setup($,{expose:M,emit:h}){const n=o(null),t=o(null),P=()=>{t.value.show(),document.body.style.overflow="auto",document.body.style.paddingRight="0px"},y=()=>{setTimeout(()=>{document.activeElement.blur()},100),t.value.hide(),k("emitCloseMusicPlaylistModal")},m=$,k=h;return W(()=>{C(()=>{t.value=new ds(n.value,{backdrop:!1,focus:!0})})}),M({showMusicPlaylistModal:P,closeMusicPlaylistModal:y}),(l,u)=>(d(),r("div",{class:"modal fade",ref_key:"musicPlaylistModalRef",ref:n},[s("div",ps,[s("div",ys,[s("div",{class:"modal-header"},[u[1]||(u[1]=s("h1",{class:"modal-title fs-5"},"KK music",-1)),s("button",{type:"button",class:"btn border-0 ms-auto",onClick:y},u[0]||(u[0]=[s("i",{class:"bi bi-x-lg"},null,-1)]))]),s("div",vs,[m.musicPlaylistData.id?(d(),r("iframe",{key:0,src:`https://widget.kkbox.com/v1/?id=${m.musicPlaylistData.id}&type=playlist&terr=TW&lang=TC&autoplay=${m.musicPlaylistData.autoplay}`,allow:"autoplay",class:"w-100 w-md-50 playlist"},null,8,gs)):(d(),r("p",_s,"無歌單 id，無法播放音樂"))])])])],512))}},Ms=us(bs,[["__scopeId","data-v-aa650060"]]),hs={class:"wrapper"},Ps={class:"playlist-banner pb-lg-13 pb-9"},ks=["src"],xs={class:"playlist-content pt-8 pt-lg-10"},ws={class:"container position-relative"},Ts={class:"row mt-lg-9"},Cs={class:"col-lg-4"},$s={class:"image-area d-flex flex-md-column align-items-start"},Ds={class:"playlist mb-lg-5 mb-3"},Rs=["src","alt"],Ls={class:"singer d-flex flex-column ms-6 ms-md-0"},Es={class:"d-flex align-items-center"},Ss=["src"],Bs={class:"fs-6 ms-3"},Vs={class:"mt-md-5 my-3 fs-7 fs-sm-6"},Fs={class:"col-lg-8"},js={class:"fs-5 fs-md-3 fs-lg-2 mb-4 mb-lg-6"},Ns={class:"fs-7 fs-sm-6"},Ws={class:"play-album-area mt-lg-8 mt-5"},As={class:"playlist-all-tracks my-8 mt-md-10"},Hs={class:"list-group list-group-flush ranking-list mt-6"},Is={class:"fw-bolder text-warning fs-6"},Ks={class:"playlist-single-info d-flex align-items-center ms-lg-5 ms-3"},qs=["src","alt"],zs={class:"ms-lg-4 ms-2"},Os={class:"single-name fs-md-6 fs-7 mb-1"},Gs={class:"singer-name fs-7"},Js=["onClick"],al={__name:"PlaylistView",setup($){const M=U(),{getConfigAuthToken:h}=M,n=o({}),t=o({isLoading:!1,fullPage:!0,bgColor:"rgba(0,0,0,0.9)"}),P=Y(()=>({active:t.value.isLoading,fullPage:t.value.fullPage,...t.value.bgColor&&{backgroundColor:t.value.bgColor}})),y=()=>{t.value.isLoading=!0},m=()=>{t.value.isLoading=!1},k=is(),l=o({}),u=e=>{y(),N.get(`https://api.kkbox.com/v1.1/featured-playlists/${e}?territory=TW`,n.value).then(a=>{l.value=a.data,A(l.value.id)})},D=o([]),A=e=>{N.get(`https://api.kkbox.com/v1.1/featured-playlists/${e}/tracks?territory=TW&limit=100 `,n.value).then(a=>{D.value=a.data.data,m()})},R=ns(),{singleRankData:v,isMusicPlaying:g,musicPlaylistData:x,isMusicPlaylistPlaying:w}=Z(R),{resetMusicTrackData:H,resetMusicPlaylistData:I}=R,f=o(null),_=o(null),K=e=>{g.value&&f.value.closeMusicModal(),x.value.id=e,x.value.autoplay=!0,w.value=!0,C(()=>{setTimeout(()=>{_.value.showMusicPlaylistModal()},300)})},q=()=>{I()},z=e=>{v.value.id!==e&&(g.value?f.value.closeMusicModal():w.value&&_.value.closeMusicPlaylistModal(),v.value.id=e,v.value.autoplay=!0,g.value=!0,C(()=>{setTimeout(()=>{f.value.showMusicModal()},300)}))},O=()=>{H()},G=cs(),{processDateExpression:J}=G,Q=()=>{w.value&&_.value.closeMusicPlaylistModal(),g.value&&f.value.closeMusicModal()};return ss(()=>{Q()}),W(async()=>{n.value=await h(),u(k.params.playlistId)}),(e,a)=>{var L,E,S,B,V,F,j;return d(),r("div",hs,[p(X,ls(as(P.value)),null,16),p(rs),s("main",null,[s("section",Ps,[s("img",{src:(L=l.value.images)==null?void 0:L[2].url,class:"bg-playlist"},null,8,ks),s("div",xs,[s("div",ws,[s("div",Ts,[s("div",Cs,[s("div",$s,[s("div",Ds,[s("img",{src:(E=l.value.images)==null?void 0:E[1].url,class:"rounded-5",alt:(S=l.value)==null?void 0:S.title},null,8,Rs)]),s("div",Ls,[s("div",Es,[s("img",{src:(V=(B=l.value.owner)==null?void 0:B.images)==null?void 0:V[0].url,class:"rounded-circle",alt:""},null,8,Ss),s("h3",Bs,c((F=l.value.owner)==null?void 0:F.name),1)]),s("p",Vs," 更新時間 : "+c(T(J)((j=l.value)==null?void 0:j.updated_at)),1)])])]),s("div",Fs,[s("h2",js,c(l.value.title),1),s("p",Ns,c(l.value.description),1),s("div",Ws,[s("button",{type:"button",class:"btn btn-info rounded-5",onClick:a[0]||(a[0]=i=>{var b;return K((b=l.value)==null?void 0:b.id)})},a[1]||(a[1]=[ts(" 播放歌單 "),s("i",{class:"bi bi-play-btn-fill"},null,-1)]))]),s("div",As,[a[3]||(a[3]=s("h4",{class:"fs-5 fs-md-4 text-warning pt-6 pt-lg-12"}," 全歌單曲目 ",-1)),s("ul",Hs,[(d(!0),r(es,null,os(D.value,(i,b)=>(d(),r("li",{class:"list-group-item d-flex align-items-center playlist-item",key:i.id},[s("h4",Is,c(b+1),1),s("div",Ks,[s("img",{src:i.album.images[0].url,alt:i.album.name},null,8,qs),s("div",zs,[s("h5",Os,c(i.name),1),s("h6",Gs,c(i.album.artist.name),1)])]),s("button",{type:"button",class:"btn btn-custom-play ms-auto",onClick:Qs=>z(i.id)},a[2]||(a[2]=[s("i",{class:"bi bi-play-fill"},null,-1)]),8,Js)]))),128))])])])])])]),p(Ms,{ref_key:"musicPlaylistModalRef",ref:_,"music-playlist-data":T(x),onEmitCloseMusicPlaylistModal:q},null,8,["music-playlist-data"]),p(fs,{ref_key:"musicTrackModalRef",ref:f,"single-rank-data":T(v),onEmitCloseTrackMusicModal:O},null,8,["single-rank-data"])])]),p(ms)])}}};export{al as default};
