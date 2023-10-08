var sections = [
  {
    title_id: "cpu-title",
    description_id: "cpu-description",
    index: 0,
    title: "Central Processing Unit (CPU)",
    description: `A CPU (Central Processing Unit) is:
The core of every Personal Computer. Without it, no PC can function.
A microchip on a motherboard, acts as the computer's brain - performs calculations and coordinate hardware components.
The speed of the CPU is measured in hertz - number of cycles per second that the CPU runs at. One instruction is processed for each cycle.
5 Gigahertz (5 Ghz) process 5 billion jobs per second. 200 Megahertz (200 Mhz) process 200 million jobs per second.
Basically, the faster the speed of the CPU, the more instructions can be processed in a given period of time.`,
  },
  {
    title_id: "ram-title",
    description_id: "ram-description",
    index: 0,
    title: "Random Access Memory (RAM)",
    description: `RAM is the memory in a computer that stores computer programs while they are running and also any data the programs need to undertake their task.
Information in the RAM can be read and written quickly
RAM is volatile - Data is lost every time the computer is turned off.`
  },
  {
    title_id: "rom-title",
    description_id: "rom-description",
    index: 0,
    title: "Read Only Memory (ROM)",
    description: `ROM is a form of non-volatile memory - data persists even when the power to the device is turned off.
ROM is used to store permanent data such as the hardware settings in a network card or the complete program than an embedded computer needs when switched on.`
  }
];
var speed = 50; /* The speed/duration of the effect in milliseconds */

/** @param {number} x */
function easeOutCubic(x) {
  return 1 - Math.pow(1 - x, 3);
}

function typeWriter(section) {
    if (section.index < section.title.length) {
      document.getElementById(section.title_id).innerHTML += section.title.charAt(section.index);
      section.index++;
      setTimeout(() => typeWriter(section), speed);
    } else {
      const element = document.getElementById(section.description_id);
      element.style.opacity = 0;
      element.innerHTML = section.description.replace(/\n/g, "<br></br>");

      const interval = setInterval(() => {
        if (Number(element.style.opacity) >= 1) {
          clearInterval(interval);
        }
        element.style.opacity = Number(element.style.opacity) + 0.1;
      }, 50);
    }
  }

for (const section of sections) {
    typeWriter(section);
}

const components = {
  "control unit": `<h3>Control Unit</h3><p>The part of the processor that coordinates the activity of all other components</p>`,
  "buses": `<h3>Buses</h3><p>A series of connectors that transfer signals between internal components</p>
<h4>System Bus has 3 seperate buses:</h4>
<li><strong>Control Bus</strong>: </li>
<br/>
<li><strong>Address Bus</strong>: </li>
<br/>
<li><strong>Data Bus</strong>: </li>`,
  "alu": `<h3>Arithmetic-Logic Unit (ALU)</h3><p>The problem solving part of the processor</p>`,
  "dedicated registers": `<h3>Dedicated registers used by the processor include:</h3>
  <p>
  
<li>Program counter (PC)</li>
<br>
<br>
<li style="padding-left:20px;">holds the memory address of the next instruction to be executed</li>
<br>
<br>
<li>Current Instruction Register (CIR)</li>
<br>
<br>
<li style="padding-left:20px;">holds the current instruction, which is split into opcode and operand</li>
<br>
<br>
<li>Memory Address Register (MAR)</li>
<br>
<br>
<li style="padding-left:20px;">holds the address in memory where the processor is required to fetch or store data from or to</li>
<br>
<br>
<li>Memory Data Register (MDR)</li>
<br>
<br>
<li style="padding-left:20px;">temporarily holds data moving between the processor and main memory</li>
<br>
<br>
<li>Accumulator</li>
<br>
<br>
<li style="padding-left:20px;">to hold intermediate results of an instruction</li>
  </p>`
};

const answered = [];

/**
 * @param {HTMLInputElement} ele
 * @param {HTMLButtonElement} submitElement 
 */
function sendSubmitData(ele, submitElement) {
  const value = ele.value;
  if (Object.keys(components).includes(value.toLowerCase())) {
    answered.push(value);
    submitElement.outerHTML = components[value];
    return;
  };
  // reassign it to avoid webpage from refreshing
  submitElement.outerHTML = submitElement.outerHTML;
};

/**
 * Alternative way to submit data to js
 * @param {Event} event
 * @param {HTMLElement} element
 */
function clickPress(event, element, submitElement) {
  if (event.key == "Enter") {
      sendSubmitData(element, submitElement)
  }
}
