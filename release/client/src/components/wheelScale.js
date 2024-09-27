export function wheelScale(obj, deltaScale, hoverElId, maxScale, minScale) {
  //removeEventListener('wheel', )
  function handleWheel(event){
    if(!mouseHover){
      if (event.deltaY > 0) {
        obj.scale += deltaScale;
        if(obj.scale > maxScale){
          obj.scale = maxScale;
        }
      }
      else if (event.deltaY < 0) {
        obj.scale -= deltaScale;
        if(obj.scale < minScale){
          obj.scale = minScale;
        }
      }
    }
  }
  //removeEventListener('wheel', handleWheel)
  let mouseHover = false;
  document.getElementById(hoverElId).addEventListener('mouseover', (event)=>{mouseHover = true})
  document.getElementById(hoverElId).addEventListener('mouseleave', ()=>{
    mouseHover = false;
  })
  addEventListener('wheel', handleWheel)
}