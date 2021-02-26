import * as c from './../Actions/ActionTypes'
export default (state = null, action) => {
  switch(action.type){
    case c.ANIME_ONE:
      return 'one';
    case c.ANIME_TWO:
      return 'two';
    case c.ANIME_CLEAR:
      return null;
    default:
      return state;
  }
}