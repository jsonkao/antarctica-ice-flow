const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const { offsetLeft, offsetTop } = canvas;

canvas.addEventListener('click', ({ pageX, pageY }) => {
  const branch = new Path2D();  
  branch.rect(pageX - offsetLeft, pageY - offsetTop, 10 + Math.ceil(Math.pow(pageY, .6)) * 4, 4);
  ctx.fill(branch);
})