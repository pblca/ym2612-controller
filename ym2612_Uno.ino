#include "digitalWriteFast.h"

/* Map Uno pins to YM2612 pins */
/* RD can be tied to 3.3 V for now */
#define YM_A0   13
#define YM_A1   12
#define YM_CS   11
#define YM_WR   10
#define YM_D0   2
#define YM_D1   3
#define YM_D2   4
#define YM_D3   5
#define YM_D4   6
#define YM_D5   7
#define YM_D6   8
#define YM_D7   9
#define YM_IC   1

/* transfer one byte to data lines */
/* This code can be optimized later */
void WriteYMData(uint32_t data) {
  digitalWriteFast( YM_D0, 0x01);
  digitalWriteFast( YM_D1, 0x02);
  digitalWriteFast( YM_D2, 0x04);
  digitalWriteFast( YM_D3, 0x08);
  digitalWriteFast( YM_D4, 0x10);
  digitalWriteFast( YM_D5, 0x20);
  digitalWriteFast( YM_D6, 0x40);
  digitalWriteFast( YM_D7, 0x80);  
}

void setreg(uint32_t addr, uint32_t data) {
  digitalWriteFast( YM_A0, 0);    /* A0 = 0 for register addres write */
  delayMicroseconds(2);
  digitalWriteFast( YM_CS, 0);    /* CS low to select */
  WriteYMData(addr);
  digitalWriteFast( YM_WR, 0);
  delayMicroseconds(2);
  digitalWriteFast( YM_WR, 1);
  digitalWriteFast( YM_CS, 1);    /* CS high */
  delayMicroseconds(2);
  digitalWriteFast( YM_A0, 1);    /* A0 = 1 for register data write */
  delayMicroseconds(2);
  digitalWriteFast( YM_CS, 0);    /* CS low to select */
  WriteYMData(data);
  digitalWriteFast( YM_WR, 0);
  delayMicroseconds(2);
  digitalWriteFast( YM_WR, 1);
  digitalWriteFast( YM_CS, 1);    /* CS high */
}


//////////////////////////////////////////
//  SETUP AND LOOP
//////////////////////////////////////////


void setup() {
  pinModeFast(YM_A0, OUTPUT);
  pinModeFast(YM_A1, OUTPUT);
  pinModeFast(YM_CS, OUTPUT);
  pinModeFast(YM_WR, OUTPUT);
  pinModeFast(YM_IC, OUTPUT);
  pinModeFast(YM_D0, OUTPUT);
  pinModeFast(YM_D1, OUTPUT);
  pinModeFast(YM_D2, OUTPUT);
  pinModeFast(YM_D3, OUTPUT);
  pinModeFast(YM_D4, OUTPUT);
  pinModeFast(YM_D5, OUTPUT);
  pinModeFast(YM_D6, OUTPUT);
  pinModeFast(YM_D7, OUTPUT);

//  analogWriteFrequency(YM_CLK, 4000000);
//  analogWrite(YM_CLK, 128);

  digitalWriteFast(YM_A1, 0);
  digitalWriteFast(YM_CS, 1);
  digitalWriteFast(YM_WR, 1);
  digitalWriteFast(YM_IC, 1);

  /* Now try to setup for making sounds */

  /* Reset YM2612 */
  digitalWriteFast(YM_IC, 0);
  delay(10);
  digitalWriteFast(YM_IC, 1);
  delay(10);

  
  /* YM2612 Test code */ 
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


void loop() {
    delay(1000);
    setreg(0x28, 0xF0); // Key on
    delay(1000);
    setreg(0x28, 0x00); // Key off
}
