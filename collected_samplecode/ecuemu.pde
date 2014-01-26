
/*
 * Author: Adrian Brzeziński
 * Contact: adrb@wp.pl or iz0@poczta.onet.pl
 * Description: Simple KWP2000 emulator
 *
 * This work is licensed under the Creative Commons Attribution-NonCommercial-NoDerivs License.
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-nd/3.0/ or,
 * send a letter to Creative Commons, 171 2nd Street, Suite 300, San Francisco, California, 94105, USA.
*/

import processing.serial.*;

PrintWriter log = createWriter("d:\\log.txt");
Serial ecuPort;
boolean init = false;

int serialInArray[] = new int[255];
int serialCount = 0;
int packetlen = 0;

boolean setbyte = false;
int bindex = 0;
int bval = 0;

int kwp_rstcom[] = { 0x81, 0x11, 0xf1, 0x81, 0x04};
int kwp_sstcom[] = { 0x83, 0xF1, 0x11, 0xC1, 0xEF, 0x8F, 0xC4};
int kwp_tstpresent[] = { 0x81, 0xf1, 0x11, 0x7e, 0xff };
int kwp_sdefresp[] = { 0x83, 0xf1, 0x11, 0x7f, 0x1a, 0x12, 0x2E};
int kwp_5a81[] = {
      0xab, 0xf1, 0x11, 0x5a, 0x81, 0x04, 0x90,
      0x6f, 0x62, 0x03, 0x92, 0x6a, 0x03, 0x91,
      0x6b, 0x03, 0x9f, 0x6a, 0x03, 0x94, 0x6a,
      0x03, 0x95, 0x02, 0x03, 0x96, 0x66, 0x03,
      0x9a, 0x02, 0x03, 0x97, 0x66, 0x03, 0x93,
      0x01, 0x03, 0x98, 0x6a, 0x03, 0x99, 0x44,
      0x03, 0x9b, 0x66, 0xff, 0xaf };

int kwp_5a80[] = {
      0x80, 0xf1, 0x11, 0x61, 0x5a, 0x80, 0x57,
      0x30, 0x4c, 0x30, 0x53, 0x42, 0x46, 0x30,
      0x30, 0x59, 0x30, 0x30, 0x30, 0x30, 0x30,
      0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30,
      0x30, 0x30, 0x30, 0x30, 0x30, 0x39, 0x30,
      0x35, 0x33, 0x32, 0x36, 0x30, 0x39, 0x20,
      0x52, 0x59, 0x30, 0x32, 0x36, 0x31, 0x32,
      0x30, 0x34, 0x30, 0x35, 0x38, 0x32, 0x38,
      
      0x53, 0x41, 0x34, 0x31, 0x34, 0x33, 0x20,
      0x20, 0x1e, 0x73, 0x42, 0x39, 0x37, 0x30,
      0x30, 0x33, 0x6,  0x1,  0x58, 0x31, 0x30,
      0x58, 0x45, 0x20, 0x1,  0xff, 0xff, 0xff,
      0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
      0x19, 0x99, 0x11, 0x17, 0x33, 0x30, 0x30,
      0x37, 0x30, 0x33, 0x95 };

int kwp_sgetloc[] = new int[59];

void setup() {

  size(400, 300);
  
  // create a font with the third font available to the system:
  PFont myFont = createFont(PFont.list()[2], 14);
  textFont(myFont);

  println(Serial.list());

  ecuPort = new Serial(this,"COM5",10400);
}

byte checksum( int data[], int len ) {

  byte crc = 0;

  while ( len > 0 ) {
    len--;
    crc = (byte)(crc + byte(data[len]&0xff));
  }

return crc;
}

void draw() {
  background(0);
  text("init: "+init, 5, 20);
  text("packetlen: "+packetlen, 5, 35 );
  
  text("setbyte: "+setbyte, 5, 60 );
  text("index: "+bindex, 5, 75 );
  text("value: "+bval, 5, 90 );
}

void serialEvent(Serial myPort) {

  serialInArray[serialCount] = myPort.read();
  if ( !(serialCount == 0 && serialInArray[0] == 0) ) {

    // this is bi-directional line, so we must send back what we got
    myPort.write(serialInArray[serialCount]);

    log.print(hex(serialInArray[serialCount])+":");
    log.flush();

    if ( init && (serialInArray[0] & 0xC0) != 0x80 ) init = false;

    if ( init )
      serialCount++;
    else
      if ( serialInArray[0] == 0x81 ) {
        init = true;
        serialCount++;
        log.println("\r\n------------------------------------------------\r\n");
      }
  }

  if ( !init ) return;

  // check how many bytes have packet
  if ( packetlen == 0 && serialCount == 4  ) {

    packetlen = serialInArray[0] & 0x3f;
    if ( packetlen == 0 ) packetlen = serialInArray[3] + 1;
    packetlen += 4;
  }

  // we got full packet now
  if ( (packetlen > 0) && (packetlen == serialCount) ) {

    int data = 0;
    
    if ( (serialInArray[0] & 0x3f) == 0 )
      data = 4;
    else
      data = 3;

    log.println("\r\nwrite:");
    delay(20);

    switch ( serialInArray[data] ) {
      case 0x81:
        for ( int i = 0; i < kwp_sstcom.length ; i++ ) {
          myPort.write(byte(kwp_sstcom[i]&0xff));
          log.print(hex(kwp_sstcom[i])+":");
          delay(5);
        }
      break;
      case 0x3e:
      kwp_tstpresent[kwp_tstpresent.length-1] = checksum(kwp_tstpresent,kwp_tstpresent.length-1);
        for ( int i = 0; i < kwp_tstpresent.length ; i++ ) {
          myPort.write(byte(kwp_tstpresent[i]&0xff));
          log.print(hex(kwp_tstpresent[i])+":");
          delay(5);
        }
      break;
      case 0x1a:
        if ( serialInArray[data+1] == 0x81 ) {
          for ( int i = 0; i < kwp_5a81.length ; i++ ) {
            myPort.write(byte(kwp_5a81[i]&0xff));
            log.print(hex(kwp_5a81[i])+":");
            delay(5);
          }
        } else if ( serialInArray[data+1] == 0x80 ) {

          kwp_5a80[kwp_5a80.length-1] = checksum(kwp_5a80,kwp_5a80.length-1);
          for ( int i = 0; i < kwp_5a80.length ; i++ ) {
            myPort.write(byte(kwp_5a80[i]&0xff));
            log.print(hex(kwp_5a80[i])+":");
            delay(5);
          }
        }
      break;
      
      case 0x21:
        kwp_sgetloc[0] = 0xb7;
        kwp_sgetloc[1] = 0xf1;
        kwp_sgetloc[2] = 0x11;
        kwp_sgetloc[3] = 0x61;

        kwp_sgetloc[4] = 0x1;  // local id?

        kwp_sgetloc[5] = 0x2;  // dtc num
        kwp_sgetloc[6] = 0x3;  // P0335
        kwp_sgetloc[7] = 0x35;
        kwp_sgetloc[8] = 0xa0;  // dtc status
        kwp_sgetloc[9] = 0x1;  // P0100
        kwp_sgetloc[10] = 0x0;
        kwp_sgetloc[11] = 0xa2;  // dtc status

        kwp_sgetloc[12] = 0x34;  // remaining data size

        // mass air flow sensor
        kwp_sgetloc[13] = 0x28;  // 0 - 4.97V : (x/256)*5

        // engine load signal ms
        kwp_sgetloc[14] = 0xb1; // 0 - 12.2ms : (x/256)*12.5

        // battery voltage
        kwp_sgetloc[15] = 0xbd; // 0 - 17.4 : (x/256)*17.5
        
        // intake air temperature
        kwp_sgetloc[16] = 0xc2; // 0 - 4.97: (x/256)*5
        
        // coolant temperature
        kwp_sgetloc[17] = 0x5f; // 0 - 4.97: (x/256)*5

        // spark angle before tdc (Top dead centre)
        kwp_sgetloc[18] = 0x0;  // 0x0 - 72, 96 - 0
        
        // knock retard
        kwp_sgetloc[19] = 0x34; // 0 - 191CA: (x/256)*192
        
        // tps signal (Throttle Position Sensor) Volt
        kwp_sgetloc[20] = 0x14;  // 0 - 4.97: (x/256)*5

        // throttle valve angle (stopnie)
        kwp_sgetloc[21] = 0x0; // 0 - 102: (x/256)*105

        // vehicle speed km/h
        kwp_sgetloc[22] = 0x0;  // x km/h

        // engine speed (RPM) / calculated air flow (kg/h)
        kwp_sgetloc[23] = 0x1d;  // 0 - 10200 : (x*40)

        // Injection pulse ms
        kwp_sgetloc[24] = 0x66;  // 0 - 97.9: x*0.4 ms
        kwp_sgetloc[25] = 0x0; // (0.2-0.5)

        // 
        kwp_sgetloc[26] = 0x0;
        kwp_sgetloc[27] = 0x0;
        kwp_sgetloc[28] = 0x0;
        kwp_sgetloc[29] = 0x7d;

        // desired engine idle speed rpm
        kwp_sgetloc[30] = 0x47; // 0 - 2550: x*10 rpm

        // desired idle air (kg/h)
        kwp_sgetloc[31] = 0xff;  // 0 - 61: (x/256)*62

        // actual value idle air kg/h
        kwp_sgetloc[32] = 0x0;  // 0 - 61: (x/256)*62

        // o2 sensor mV
        kwp_sgetloc[33] = 0x0; // 0-1244, (x*(5/1024))*1000

        kwp_sgetloc[34] = 0x80;
        
        // o2 loop integrator Steps
        kwp_sgetloc[35] = 0x0;  // x

        kwp_sgetloc[36] = 0x68;
        
        // o2 loop BLM Idle (Block Learn Map) Steps
        kwp_sgetloc[37] = 0x8b;  // x
        
        // o2 loop BLM Partial Load (Block Learn Map) Steps
        kwp_sgetloc[38] = 0x0;  // x
        
        kwp_sgetloc[39] = 0x0;
        kwp_sgetloc[40] = 0x80;
        kwp_sgetloc[41] = 0x0;
        
        // Fuel tank ventilation valve %
        kwp_sgetloc[42] = 0x0;  // 0-99%: (x/256)*100%

        // EGR Pulse Ratio (Exhaust Gas Recirculation) %
        kwp_sgetloc[43] = 0x3c;  // 0-99%: (x/256)*100%

        // EGR Position Feedback (Exhaust Gas Recirculation) Volt
        kwp_sgetloc[44] = 0x0;  // 0 - 4.97V: (x/256)*5

        // Torque Control %
        kwp_sgetloc[45] = 0x0;  // 0-99%: (x/256)*100%

        kwp_sgetloc[46] = 0x0;
        kwp_sgetloc[47] = 0x2;

        // x&0x1 == 1 - active, Simulated full load switch
        // x&0x2 == 1 - closed, == 0 open, Idle Switch
        // x&0x4 == 1 - R-D-3-2-1 12V == 0 P - N 0V, park/neutral switch
        // x&0x8 == 1 - Recived == 0 Not recived, vehicle speed pulse
        // x&0x10 == 1 - Active 12V == 0 Inactive 0V, A/C Compressor Switch (Air Conditioning)
        // x&0x20 == 1 - Active 12V == 0 Inactive 0V, A/C Information Switch
        kwp_sgetloc[48] = 0x1;

        kwp_sgetloc[49] = 0xb;

        // x&0x1 == 1 Active, == 0 Inactive, Immobiliser
        // x&0x2 == 1 Recived, == 0 Not Recived, Immobiliser Signal
        // x&0x8 == 1 Inactive ,== 0 Active, Engine Speed Pulse
        // x&0x10 == 1 Rich, == 0 Lean, Air/Fuel ratio
        // x*0x40 == 1 Closed, == 0 Open, o2 sensor loop
        kwp_sgetloc[50] = 0x40;

        // x&0x1 == 1 Active, == 0 Inactive, Hall Sensor
        // x&0x2 == 1 Active, == 0 Inactive, Knock Signal
        // x&0x10 == 1 Active, == 0 Inactive, Torque Control
        kwp_sgetloc[51] = 0x1;

        // x&0x1 == 1 On 0V, == 0 Off 12V, Telltale (Check Light)
        // x&0x8 == 1 Active, == 0 Inactive, A/C Relay (Air Conditioning)
        // x&0x10 == 1 Active, ==0 Inactive, EGR Valve (Exhaust Gas Recirculation)
        // x&0x80 == 1 Active 0V, == 0 Inactive 12V, Fuel Pump Relay
        kwp_sgetloc[52] = 0x2f;

        // x&0x1 == 1 Load, == 0 Spark, Ignition Coil 1
        // x&0x2 == 1 Load, == 0 Spark, Ignition Coil 2
        // x&0x4 == 1 Load, == 0 Spark, Ignition Coil 3
        // x&0x8 == 1 Load, == 0 Spark, Ignition Coil 4
        kwp_sgetloc[53] = 0xa;

        // x&0x1 == 1 Automatic Transmission, == 0 Manual Transmission, Transmission Coding
        // x&0x2 == 1 3 Cylinder, == 0 4 Cylinder, Engine Type
        kwp_sgetloc[54] = 0x0;
        kwp_sgetloc[55] = 0x0;
        kwp_sgetloc[56] = 0x0;
        kwp_sgetloc[57] = 0x0;

        if ( setbyte ) kwp_sgetloc[bindex] = bval;

        kwp_sgetloc[kwp_sgetloc.length-1] = checksum(kwp_sgetloc,kwp_sgetloc.length-1);
        for ( int i = 0; i < kwp_sgetloc.length ; i++ ) {
          myPort.write(byte(kwp_sgetloc[i]&0xff));
          log.print(hex(kwp_sgetloc[i])+":");
          delay(5);
        }
      break;
      default:
      // service not supported
        kwp_sdefresp[4] = serialInArray[data];
        kwp_sdefresp[6] = checksum(kwp_sdefresp,6);

        for ( int i = 0; i < kwp_sdefresp.length ; i++ ) {
          myPort.write(byte(kwp_sdefresp[i]&0xff));
          log.print(hex(kwp_sdefresp[i])+":");
          delay(5);
        }
    }

    log.println("\r\nread:");
    log.flush();

    packetlen = 0;
    serialCount = 0;
  }
}

void keyPressed() {
  if ( key == 'r' ) init = false;
  if ( key == 'q' ) setbyte = !setbyte;
  if ( key == 'w' ) bindex++;
  if ( key == 's' ) bindex--;
  if ( key == 'd' ) bval++;
  if ( key == 'a' ) bval--;
}

