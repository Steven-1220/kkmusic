import{r as d,d as F,s as N,f as A,a as $,I as H,g as e,i as c,j as I,k as W,l as s,v as o,q as f,m as _,u as h,F as b,t as k,A as z,J,x as l,n as U}from"./index-CIE1iGTc.js";import{u as G,L as K,a as O}from"./LoadingEffect-DU9-MKMv.js";import{u as Q}from"./musicPlayer-DVtYIYYM.js";import{u as X}from"./tools-DEd7rTvw.js";import{H as Y,F as Z}from"./FooterView-DrzeW8RO.js";import{P as ss}from"./PlayTrackMusic-BaR8ASFq.js";const as={class:"wrapper"},ts={class:"search-page py-lg-13 py-9"},es={class:"container"},ls={class:"fs-lg-2 fs-3 text-center mb-lg-8 mb-6"},os={class:"text-warning"},ns={key:0,class:"row g-4 mb-lg-10 mb-8"},cs={class:"d-flex justify-content-between align-items-center px-10 px-sm-2"},is={class:"card card-search-album text-bg-dark h-100"},rs=["src","alt"],us={class:"fs-lg-5 fs-6"},ds={class:"fs-lg-5 fs-6"},ms={class:"card-text"},gs={key:1,class:"row mb-8"},fs={class:"fs-4 fs-lg-3 text-center"},_s={key:2,class:"row g-4 mb-lg-10 mb-8"},hs={class:"d-flex justify-content-between align-items-center"},vs={class:"col"},ps={class:"row row-cols-lg-2 row-cols-1 list-search gy-3 ps-0"},ys={class:"search-single-info d-flex align-items-center"},bs=["src","alt"],ks={class:"ms-lg-4 ms-2"},ws={class:"single-name fs-6 mb-1"},xs={class:"singer-name fs-7"},Ms=["onClick"],qs={key:3,class:"row mb-8"},Ts={class:"fs-4 fs-lg-3 text-center"},Ps={key:0,class:"container"},Cs={class:"d-flex justify-content-between align-items-center mb-4"},Ls={class:"row row-cols-lg-6 row-cols-md-3 row-cols-2 gy-4"},Rs=["src","alt"],Ss={class:"card-body"},Bs={class:"fs-lg-6 fs-7 mb-2"},Vs={class:"fs-7"},js={key:1,class:"container"},Ds={class:"row"},Es={class:"fs-4 fs-lg-3 text-center"},Js={__name:"SearchView",setup(Fs){const T=G(),{getConfigAuthToken:P}=T,w=d({}),u=d({isLoading:!1,fullPage:!0,bgColor:"rgba(0,0,0,0.9)"}),C=F(()=>({active:u.value.isLoading,fullPage:u.value.fullPage,...u.value.bgColor&&{backgroundColor:u.value.bgColor}})),L=()=>{u.value.isLoading=!0},R=()=>{u.value.isLoading=!1},x=d({albums:{data:[]},playlists:{data:[]},tracks:{data:[]}}),i=d(""),n=d({albums:[],playlists:[],tracks:[]}),M=r=>{L(),O.get(`https://api.kkbox.com/v1.1/search?q=${r}&territory=TW&type=artist,track,album,playlist&limit=24 `,w.value).then(a=>{x.value.albums.data=a.data.albums.data,n.value.albums=a.data.albums.data.splice(0,12),x.value.playlists.data=a.data.playlists.data,n.value.tracks=a.data.tracks.data,n.value.playlists=a.data.playlists.data.splice(0,6),R()})},q=Q(),{singleRankData:v,isMusicPlaying:y}=N(q),{resetMusicTrackData:S}=q,p=d(null),B=r=>{v.value.id!==r&&(y.value&&p.value.closeMusicModal(),v.value.id=r,v.value.autoplay=!0,y.value=!0,U(()=>{setTimeout(()=>{p.value.showMusicModal()},300)}))},V=()=>{S()},j=X(),{processDash:D}=j,E=()=>{y.value&&p.value.closeMusicModal()};A(()=>{E()});const m=z();return $(async()=>{w.value=await P(),m.query.q&&(i.value=m.query.q,M(i.value))}),H(r=>{r.query.q&&(i.value=r.query.q,M(i.value))}),(r,a)=>{const g=J("RouterLink");return l(),e("div",as,[c(K,I(W(C.value)),null,16),c(Y),s("main",null,[s("section",ts,[s("div",es,[s("h2",ls,[s("strong",os,o(i.value),1),a[0]||(a[0]=f(" 搜尋結果 "))]),n.value.albums.length!==0?(l(),e("div",ns,[s("div",cs,[a[2]||(a[2]=s("h3",{class:"fs-4 fs-lg-3"},"專輯",-1)),c(g,{class:"btn-more-content",to:{name:"searchAlbum",query:{...h(m).query,page:1}}},{default:_(()=>a[1]||(a[1]=[f(" 查看更多 "),s("i",{class:"bi bi-arrow-right-circle"},null,-1)])),_:1},8,["to"])]),(l(!0),e(b,null,k(n.value.albums,t=>(l(),e("div",{class:"col-xxl-2 col-lg-3 col-md-4 col-sm-6 d-flex justify-content-center",key:t.id},[s("div",is,[s("img",{src:t.images[1].url,class:"card-img-top",alt:t.name},null,8,rs),c(g,{class:"card-body stretched-link",to:{name:"album",params:{albumId:t.id}}},{default:_(()=>[s("h4",us,o(t.name),1),s("h5",ds,o(t.artist.name),1),s("p",ms,[s("small",null,"發行日: "+o(h(D)(t.release_date)),1)])]),_:2},1032,["to"])])]))),128))])):(l(),e("div",gs,[s("h3",fs,"無相關 "+o(i.value)+"專輯",1)])),n.value.tracks.length!==0?(l(),e("div",_s,[s("div",hs,[a[4]||(a[4]=s("h3",{class:"fs-4 fs-lg-3"},"單曲",-1)),c(g,{class:"btn-more-content",to:{name:"SearchTrack",query:{...h(m).query,page:1}}},{default:_(()=>a[3]||(a[3]=[f(" 查看更多 "),s("i",{class:"bi bi-arrow-right-circle"},null,-1)])),_:1},8,["to"])]),s("div",vs,[s("ul",ps,[(l(!0),e(b,null,k(n.value.tracks,t=>(l(),e("li",{class:"col list-search-item d-flex align-items-center",key:t.id},[s("div",ys,[s("img",{src:t.album.images[0].url,alt:t.name},null,8,bs),s("div",ks,[s("h4",ws,o(t.name),1),s("h6",xs,o(t.album.artist.name),1)])]),s("button",{type:"button",class:"btn btn-custom-play ms-auto",onClick:Ns=>B(t.id)},a[5]||(a[5]=[s("i",{class:"bi bi-play-fill"},null,-1)]),8,Ms)]))),128))])])])):(l(),e("div",qs,[s("h3",Ts,"無相關 "+o(i.value)+"單曲",1)]))]),n.value.playlists.length!==0?(l(),e("div",Ps,[s("div",Cs,[a[7]||(a[7]=s("h3",{class:"fs-4 fs-lg-3"},[f(" 歌單"),s("small",{class:"fs-md-6 fs-7"},"(官方小編與大家的歌單)")],-1)),c(g,{class:"btn-more-content",to:{name:"SearchPlaylist",query:{...h(m).query,page:1}}},{default:_(()=>a[6]||(a[6]=[f(" 查看更多 "),s("i",{class:"bi bi-arrow-right-circle"},null,-1)])),_:1},8,["to"])]),s("div",Ls,[(l(!0),e(b,null,k(n.value.playlists,t=>(l(),e("div",{class:"col",key:t.id},[c(g,{class:"card h-100",to:{name:"playlist",params:{playlistId:t.id}}},{default:_(()=>[s("img",{src:t.images[0].url,alt:t.title,class:"rounded-4"},null,8,Rs),s("div",Ss,[s("h4",Bs,o(t.title),1),s("h5",Vs,o(t.owner.name),1)])]),_:2},1032,["to"])]))),128))])])):(l(),e("div",js,[s("div",Ds,[s("h3",Es,"無相關 "+o(i.value)+"歌單",1)])]))]),c(ss,{ref_key:"musicTrackModalRef",ref:p,"single-rank-data":h(v),onEmitCloseTrackMusicModal:V},null,8,["single-rank-data"])]),c(Z)])}}};export{Js as default};