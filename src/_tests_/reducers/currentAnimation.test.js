import currentAnimationReducer from './../../Reducers/currentAnimationReducer'

describe('current animation reducer', ()=>{
  it('return default state of null if no action type defined', ()=>{
    expect(currentAnimationReducer(null, {type:null})).toEqual(null);
  })
})
