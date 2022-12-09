const Header = () => {

const sp = ("Samahd").split("")
let name= ""
let i = 0

  setInterval(() => {
    if(i < sp.length){
    name+= sp[i]
    i++
    document.querySelector('#ddd').innerText = name

    }else{
      clearInterval()
      document.getElementById('audio').style.visibility = 'visible'
    }
  }, 300);

  const playintro = () => {
    document.querySelector('#aud').play()
  }

  
  return (
    <header className='row'>
        <div className="col-md-6 biosec">
          <h1>Hello, I'm <span id="ddd"> </span><span id="audio" onClick={playintro}><img src="../sound.svg" alt="hi" /></span></h1>
        <audio src="./intro.mp3" id="aud"></audio>
          <p>My name is Abdulsalam Abdulsamad, Here you’ll find a dictionary of my professional archieve. </p>
          <p>I’m a software developer with a desire for providing effective yet efficient digital solutions. I make open-source projects and make youtube videos about code, design, life and mostly everything in-between. I like computers, football and games.

<div>More <b className="text-info">about me!</b> </div> </p>
        </div>
        <div className="col-md-6 imageheader"><img src="header.svg" alt="" /></div>
    </header>
  )
}

export default Header