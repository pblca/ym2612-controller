var j5 = require('johnny-five')
var chipio = require('chip-io')
var nanotimer = require('nanotimer')

var t = new nanotimer()

function delay(time){
  return new Promise(resolve => t.setTimeout(resolve, '',  time));
}

var board = new j5.Board({
  io: new chipio()
})

var ex = new j5.Expander("MCP23017")

var p = {
  d0:1,  // Data Bus
  d1:2,
  d2:3,
  d3:4,
  d4:5,
  d5:6,
  d6:7,
  d7:8
  a0:9,  // R/W Enable, Active High
  a1:10, // Part 1 / Part 2 ( Low=1, High=2 )
  cs:11, // Chip Select
  wr:12, // Write mode on data bus, Active Low
  ic:13, // System Reset, Initialize registers, Active Low
}

var databus = [p.d0, p.d1, p.d2, p.d3, p.d4, p.d5, p.d6, p.d7]

function WriteOPNData(data) {
  ex.analogWrite(p.d0, data & 0x01)
  ex.analogWrite(p.d1, data & 0x02)
  ex.analogWrite(p.d2, data & 0x04)
  ex.analogWrite(p.d3, data & 0x08)
  ex.analogWrite(p.d4, data & 0x10)
  ex.analogWrite(p.d5, data & 0x20)
  ex.analogWrite(p.d6, data & 0x40)
  ex.analogWrite(p.d7, data & 0x80)
}

async function setreg(address, data){
  ex.digitalWrite(p.a0, 0)
  await delay('2u')
  ex.digitalWrite(p.cs, 0)
  writeOPNData(addr)
  ex.digitalWrite(p.wr, 0)
  await delay('2u')

  ex.digitalWrite(p.wr, 1)
  ex.digitalWrite(p.cs, 1)
  await delay('2u')
  ex.digitalWrite(p.a0, 1)
  await delay('2u')
  ex.digitalWrite(p.cs, 0)
  writeONData(data)

  ex.digitalWrite(p.wr, 0)
  await delay('2u')
  ex.digitalWrite(p.wr, 1)
  ex.digitalWrite(p.cs, 1)
}

async function setup(){
  for(var i=0;i<8;i++){
    ex.pinMode(databus[i], ex.MODES.OUTPUT)
  }

  ex.digitalWrite(p.a1, 0)
  ex.digitalWrite(p.cs, 1)
  ex.digitalWrite(p.wr, 1)
  ex.digitalWrite(p.ic, 1)

  ex.digitalWrite(p.ic, 0)
  await delay('10m')
  ex.digitalWrite(p.cs, 1)
  await delay('10m')

  setreg(0x22, 0x00); // LFO off
  setreg(0x27, 0x00); // Note off (channel 0)
  setreg(0x28, 0x01); // Note off (channel 1)
  setreg(0x28, 0x02); // Note off (channel 2)
  setreg(0x28, 0x04); // Note off (channel 3)
  setreg(0x28, 0x05); // Note off (channel 4)
  setreg(0x28, 0x06); // Note off (channel 5)
  setreg(0x2B, 0x00); // DAC off
  setreg(0x30, 0x71); //
  setreg(0x34, 0x0D); //
  setreg(0x38, 0x33); //
  setreg(0x3C, 0x01); // DT1/MUL
  setreg(0x40, 0x23); //
  setreg(0x44, 0x2D); //
  setreg(0x48, 0x26); //
  setreg(0x4C, 0x00); // Total level
  setreg(0x50, 0x5F); //
  setreg(0x54, 0x99); //
  setreg(0x58, 0x5F); //
  setreg(0x5C, 0x94); // RS/AR
  setreg(0x60, 0x05); //
  setreg(0x64, 0x05); //
  setreg(0x68, 0x05); //
  setreg(0x6C, 0x07); // AM/D1R
  setreg(0x70, 0x02); //
  setreg(0x74, 0x02); //
  setreg(0x78, 0x02); //
  setreg(0x7C, 0x02); // D2R
  setreg(0x80, 0x11); //
  setreg(0x84, 0x11); //
  setreg(0x88, 0x11); //
  setreg(0x8C, 0xA6); // D1L/RR
  setreg(0x90, 0x00); //
  setreg(0x94, 0x00); //
  setreg(0x98, 0x00); //
  setreg(0x9C, 0x00); // Proprietary
  setreg(0xB0, 0x32); // Feedback/algorithm
  setreg(0xB4, 0xC0); // Both speakers on
  setreg(0x28, 0x00); // Key off
  setreg(0xA4, 0x22); //
  setreg(0xA0, 0x69); // Set frequency

}

board.on('ready', async function() {
  while(true) {
    await delay('1s');
    setreg(0x28, 0xF0); // Key on
    await delay('1s');
    setreg(0x28, 0x00); // Key off
  }
});
