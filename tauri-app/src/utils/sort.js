export function sortArrayByName(arr){
  arr.sort((a,b)=>{
    if (a.name < b.name){
      return -1;
    }
    else if (b.name < a.name){
      return 1;
    }
    return 0;
  })
}
