body {
  margin: 0;
  font-family: 'Comic Sans MS', cursive, sans-serif;
  background: radial-gradient(circle at top, #ff80bf, #8000ff);
  color: white;
  text-align: center;
  overflow: hidden;
}

.container {
  padding: 20px;
}

.photo img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid white;
  box-shadow: 0 0 15px rgba(255,255,255,0.8);
  margin-bottom: 20px;
}

.gauge {
  position: relative;
  width: 250px;
  height: 125px;
  margin: 0 auto;
  border-top-left-radius: 250px;
  border-top-right-radius: 250px;
  background: rgba(255,255,255,0.1);
  overflow: hidden;
  box-shadow: inset 0 0 20px rgba(255,255,255,0.3);
}

.dial {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, #4fc3f7, #f06292, #ff8a65, #ffeb3b, #f44336);
  clip-path: polygon(0 100%, 100% 100%, 50% 0);
}

.needle {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 4px;
  height: 120px;
  background: white;
  transform-origin: bottom center;
  transform: rotate(-90deg);
  box-shadow: 0 0 10px rgba(255,255,255,0.8);
}

.center {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
}

button {
  margin-top: 30px;
  padding: 12px 24px;
  font-size: 18px;
  border: none;
  border-radius: 25px;
  background: linear-gradient(90deg, #ff4081, #ff80ab);
  color: white;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0,0,0,0.3);
  transition: transform 0.2s;
}

button:hover {
  transform: scale(1.05);
}

.result {
  margin-top: 20px;
  font-size: 20px;
  font-weight: bold;
  text-shadow: 0 0 10px rgba(255,255,255,0.8);
}
