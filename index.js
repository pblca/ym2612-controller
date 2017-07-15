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
  await delay('10m)

   

}

board.on('ready', function() {
  
});
