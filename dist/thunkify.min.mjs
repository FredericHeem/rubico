/**
 * rubico v1.9.6
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2021 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */
const thunkify=(t,...n)=>function(){return t(...n)};export default thunkify;
