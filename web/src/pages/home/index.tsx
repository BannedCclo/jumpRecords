import { useState, useEffect, useRef } from "react";
import styles from "./Home.module.css";
import hakuna from "../../assets/audios/hakunaPepeas.mp3";
import hbirdSong from "../../assets/audios/hbird.mp3";
import last from "../../assets/audios/lastJump.mp3";
import die from "../../assets/audios/dieWithAJump.mp3";
import maui from "../../assets/audios/deJump.mp3";
import persona from "../../assets/audios/itsJampibarNow.mp3";
import jump from "../../assets/audios/jumpBear.mp3";
import queen from "../../assets/audios/pepeasRhapsody.mp3";
import fnaf from "../../assets/audios/fiveNightsAtJumps.mp3";
import peasSigma from "../../assets/images/peasSigma.jpeg";
import jumpify from "../../assets/images/jumpify.png";
import hakunaPepeas from "../../assets/images/hakunaPepeas.jpeg";
import jumpBear from "../../assets/images/jumpBear.jpeg";
import hbird from "../../assets/images/hbird.jpeg";
import dieWithAJump from "../../assets/images/dieWithAJump.jpeg";
import lastJamp from "../../assets/images/lastJamp.jpeg";
import fnaj from "../../assets/images/fnaj.jpeg";
import deJamp from "../../assets/images/deJampCover.jpeg";
import jampibarNow from "../../assets/images/personaCover.jpeg";
import queenCover from "../../assets/images/pepeasRhapsody.jpeg";

const songs = [
  {
    name: "Hakuna Pepeas",
    cover: hakunaPepeas,
    song: hakuna,
  },
  {
    name: "Hbird",
    cover: hbird,
    song: hbirdSong,
  },
  {
    name: "De Jamp",
    cover: deJamp,
    song: maui,
  },
  {
    name: "It's Jampibar Now",
    cover: jampibarNow,
    song: persona,
  },
  {
    name: "Jamp Bear",
    cover: jumpBear,
    song: jump,
  },
  {
    name: "Die With a Jamp",
    cover: dieWithAJump,
    song: die,
  },
  {
    name: "Five Nights at Jamp's",
    cover: fnaj,
    song: fnaf,
  },
  {
    name: "Pepeas Rhapsody",
    cover: queenCover,
    song: queen,
  },
  {
    name: "Last Jamp",
    cover: lastJamp,
    song: last,
  },
];

const Home = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [muted, setMuted] = useState(false);
  const [convertedDuration, setConvertedDuration] = useState("00:00");
  const [time, setTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [volumeIcon, setVolumeIcon] = useState("high");
  const [duration, setDuration] = useState(0);
  const [paused, setPaused] = useState(true);
  const [clickable, setClickable] = useState(true);
  const [currentSong, setCurrentSong] = useState(0);
  const [song, setSong] = useState(new Audio());
  const background = useRef<HTMLElement | null>(null);
  const gray = useRef<HTMLDivElement | null>(null);
  const prevCover = useRef<HTMLDivElement | null>(null);
  const currentCover = useRef<HTMLDivElement | null>(null);
  const nextCover = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    song.volume = volume;
    if (volume > 0.5) {
      setVolumeIcon("high");
    } else if (volume == 0) {
      setVolumeIcon("off");
    } else if (volume <= 0.5) {
      setVolumeIcon("low");
    }
  }, [volume]);

  useEffect(() => {
    if (!paused && !isDragging) {
      const intervalId = setInterval(() => {
        setTime(song.currentTime);
      }, 10);

      return () => clearInterval(intervalId);
    }
  }, [paused, isDragging, song]);

  useEffect(() => {
    song.play();
    song.volume = volume;
    setTime(0);
    song.addEventListener("loadedmetadata", () => {
      setDuration(Math.floor(song.duration));
      setConvertedDuration(convertDuration(Math.floor(song.duration)));
      song.currentTime = 0;
    });
  }, [song]);

  useEffect(() => {
    const newAudio = new Audio(songs[currentSong].song);
    setSong(newAudio);
    if (background.current) {
      if (window.matchMedia("(max-width: 1000px)").matches) {
        background.current.style.background = `linear-gradient(to top, #333, rgba(0, 0, 0, 0.5)), 
          url(${songs[currentSong].cover})`;
      } else {
        background.current.style.background = `linear-gradient(to right, #333, rgba(0, 0, 0, 0.5)), 
          url(${songs[currentSong].cover})`;
      }
      background.current.style.backgroundSize = "cover";
      background.current.style.backgroundPosition = "center";
    }
  }, [currentSong]);

  function nextSong() {
    if (currentSong >= songs.length - 1) {
      return 0;
    } else {
      return currentSong + 1;
    }
  }

  function prevSong() {
    if (currentSong <= 0) {
      return songs.length - 1;
    } else {
      return currentSong - 1;
    }
  }

  function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function setNextSong() {
    if (clickable) {
      song.pause();
      setClickable(false);
      if (currentCover.current && nextCover.current) {
        console.log("testeAni");
        currentCover.current.classList.toggle("currentToPrevMotion");
        nextCover.current.classList.toggle("motion");
      }
      if (gray.current) {
        gray.current.style.opacity = "1";
      }
      await delay(500);
      setCurrentSong(nextSong());
      if (nextCover.current) {
        nextCover.current.classList.toggle("motion");
      }
      if (currentCover.current) {
        currentCover.current.classList.toggle("currentToPrevMotion");
      }
      if (gray.current) {
        gray.current.style.opacity = "0";
      }
      await delay(500);
      setClickable(true);
    }
  }

  async function setPrevSong() {
    if (clickable) {
      song.pause();
      setClickable(false);
      if (currentCover.current && prevCover.current) {
        currentCover.current.classList.toggle("currentToNextMotion");
        prevCover.current.classList.toggle("motion");
      }
      if (gray.current) {
        gray.current.style.opacity = "1";
      }
      await delay(500);
      setCurrentSong(prevSong());
      if (prevCover.current) {
        prevCover.current.classList.toggle("motion");
      }
      if (currentCover.current) {
        currentCover.current.classList.toggle("currentToNextMotion");
      }
      if (gray.current) {
        gray.current.style.opacity = "0";
      }
      await delay(500);
      setClickable(true);
    }
  }

  function playPause() {
    if (song.paused) {
      setPaused(false);
      song.play();
      console.log(song.currentTime);
    } else {
      setPaused(true);
      song.pause();
      console.log(song.currentTime);
    }
  }

  function convertDuration(duration: number) {
    const minutes = Math.floor(duration / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (duration % 60).toString().padStart(2, "0");
    const result = `${minutes}:${seconds}`;
    return result;
  }

  function handleMute() {
    if (muted) {
      setMuted(false);
      if (volume > 0.5) {
        setVolumeIcon("high");
      } else if (volume == 0) {
        setVolumeIcon("off");
      } else if (volume <= 0.5) {
        setVolumeIcon("low");
      }
      song.volume = volume;
    } else {
      setVolumeIcon("xmark");
      setMuted(true);
      song.volume = 0;
    }
  }

  song.onended = setNextSong;

  return (
    <div className={styles.body}>
      <div id={styles.mobileBlock}>
        <i className="fa-solid fa-ban"></i>
        <h3>
          Para a sua melhor experiência, este site só está disponível em telas
          de computador.
        </h3>
      </div>
      <header id={styles.header}>
        <h1 id={styles.title}>Jump Records</h1>
      </header>
      <div id={styles.start}>
        <div id={styles.aboutUsContainer}>
          <h1 className={styles.sectionTitle}>Sobre nós</h1>
          <p className={styles.paragraph}>
            A Jump Records é um projeto musical feito por fãs, dedicado ao ídolo
            sigma João Hbar.
          </p>
        </div>
      </div>
      <section id={styles.hbar}>
        <div id={styles.hbarTitle}>
          <p id={styles.moai}>🗿</p>
          <h1 className={styles.blackTitle}>João Hbar</h1>
          <p id={styles.wine}>🍷</p>
        </div>
        <div id={styles.hbarContent}>
          <div id={styles.hbarImage}>
            <div>
              <img src={peasSigma} />
            </div>

            <section id={styles.captions}>
              <p>"Todos querem ser como o João,</p>
              <p>garoto sigma, sempre um leão."</p>
            </section>
          </div>
          <p className={styles.paragraph}>
            O jovem João Mário Peas Hbar sempre foi uma inspiração para toda a
            comunidade sigma. <br /> Desde criança ele já moggava todos na
            escola, principalmente quando o assunto era Skibidi Toilet. A
            imponência no seu andar já foi o bastante para conquistar muitos fãs
            ao redor da cidade e a frieza nos seus olhos para apaixonar as
            garotas do bairro.
          </p>
        </div>
      </section>
      <section id={styles.songs}>
        <h2>
          {window.matchMedia("(max-width: 1000px)").matches
            ? "Nossas músicas:"
            : "Devido à nossa admiração, iniciamos o projeto Jump Records com algumas músicas, ouça:"}
        </h2>
        <main>
          <aside>
            <img src={jumpify} />
            <div id={styles.player}>
              <h1 id={styles.songName}>{songs[currentSong].name}</h1>
              <div id={styles.time}>
                <h3>{convertDuration(Math.floor(time))}</h3>
                <input
                  type="range"
                  id={styles.timeline}
                  value={time}
                  min="0"
                  max={duration}
                  step="0.01"
                  onChange={(e) => {
                    setTime(parseFloat(e.target.value));
                  }}
                  onMouseDown={() => setIsDragging(true)}
                  onMouseUp={() => {
                    setIsDragging(false);
                    song.currentTime = time;
                  }}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onTouchEnd={() => {
                    setIsDragging(false);
                    song.currentTime = time;
                  }}
                ></input>
                <h3>{convertedDuration}</h3>
              </div>

              <div id={styles.buttons}>
                <div id={styles.volume}>
                  <i
                    className={`fa-solid fa-volume-${volumeIcon}`}
                    onClick={handleMute}
                  ></i>
                  <input
                    type="range"
                    id={styles.volumeBar}
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => {
                      setVolume(parseFloat(e.target.value));
                    }}
                  />
                </div>
                <button
                  className={`${styles.skip} ${!clickable && styles.off}`}
                  onClick={() => {
                    setPrevSong();
                    setPaused(false);
                  }}
                >
                  <i className="fa-solid fa-backward-step"></i>
                </button>
                <button
                  className={`${styles.play} ${!clickable && styles.off}`}
                  onClick={playPause}
                >
                  <i className={`fa-solid fa-${paused ? "play" : "pause"}`}></i>
                </button>
                <button
                  className={`${styles.skip} ${!clickable && styles.off}`}
                  onClick={() => {
                    setNextSong();
                    setPaused(false);
                  }}
                >
                  <i className="fa-solid fa-forward-step"></i>
                </button>
              </div>
            </div>
          </aside>
          <section ref={background}>
            <div id={styles.gray} className={styles.shown} ref={gray}></div>
            <nav className={styles.cover} ref={prevCover}>
              <img src={songs[prevSong()].cover} />
            </nav>
            <nav className={styles.cover} ref={currentCover}>
              <img src={songs[currentSong].cover} />
            </nav>
            <nav className={styles.cover} ref={nextCover}>
              <img src={songs[nextSong()].cover} />
            </nav>
          </section>
        </main>
      </section>
    </div>
  );
};

export default Home;
