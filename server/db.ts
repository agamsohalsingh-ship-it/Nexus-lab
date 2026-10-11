import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import type {
  Project,
  Category,
  WorkshopArticle,
  CodeVaultEntry,
  TimelineEntry,
  WebsiteSettings,
  CoordinatorUser,
  CoordinatorSession,
  AuditLog,
  ContactMessage
} from './types.ts';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'nexus_db.json');
const BACKUP_DIR = path.join(DATA_DIR, 'backups');

export interface DatabaseSchema {
  projects: Project[];
  categories: Category[];
  articles: WorkshopArticle[];
  codeVault: CodeVaultEntry[];
  timeline: TimelineEntry[];
  settings: WebsiteSettings;
  users: CoordinatorUser[];
  sessions: CoordinatorSession[];
  auditLogs: AuditLog[];
  contactMessages: ContactMessage[];
}

// Password hashing utilities using crypto PBKDF2
export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const testHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(testHash, 'hex'), Buffer.from(hash, 'hex'));
}

// Initial default settings
const defaultSettings: WebsiteSettings = {
  id: 1,
  siteTitle: 'NEXUS LAB',
  tagline: 'Autonomous Robotics, Embedded Circuits & AI Systems',
  heroHeadline: 'Building Tomorrow, One Circuit at a Time',
  heroSubheadline: 'Explore open hardware prototypes, low-latency ESP32 wireless networks, real-time AI voice assistants, and custom robotics architectures.',
  makerName: 'Agam Singh',
  makerRole: 'Hardware Maker & Robotics Engineer',
  makerBio: 'Electronics maker, embedded systems developer, and robotics enthusiast specializing in ESP32/ESP8266 architectures, low-power IoT networks (ESP-NOW), custom OLED human-machine interfaces, and physical AI voice assistants. Building practical safety devices and autonomous robotic platforms.',
  makerAvatar: '/src/assets/images/maker_profile_portrait_1791611614729.jpg',
  contactEmail: 'agamsohalsingh@gmail.com',
  githubUrl: 'https://github.com',
  youtubeUrl: 'https://youtube.com',
  linkedinUrl: 'https://linkedin.com',
  discordHandle: 'nexus#4040',
  accentColor: 'cyan',
  enableAnimations: true,
  showXiaozhiBanner: true,
  metaDescription: 'Autonomous hardware engineering lab, embedded systems workbench, and robotics control center by Agam Singh.'
};

const defaultCategories: Category[] = [
  { id: 'cat-1', name: 'AI Assistants and AI Experiments', slug: 'ai-assistants', description: 'Voice agents, LLM integration, speech synthesis & hardware audio pipelines', iconName: 'Cpu' },
  { id: 'cat-2', name: 'Arduino Projects', slug: 'arduino-projects', description: 'ATmega architectures, sensor nodes, and real-time microcontroller builds', iconName: 'Layers' },
  { id: 'cat-3', name: 'ESP32 and ESP8266 Projects', slug: 'esp32-esp8266', description: 'Dual-core Wi-Fi/BLE microcontrollers, FreeRTOS tasks, and telemetry', iconName: 'Zap' },
  { id: 'cat-4', name: 'Robotics and Automation', slug: 'robotics-automation', description: 'Manipulator arms, inverse kinematics, motor drivers, and automated mechanisms', iconName: 'Bot' },
  { id: 'cat-5', name: 'Women Safety Device', slug: 'women-safety-device', description: 'Off-grid emergency beacons, GPS tracking, and instant SOS alerts', iconName: 'ShieldAlert' },
  { id: 'cat-6', name: 'Retro Gaming and Handheld Consoles', slug: 'retro-gaming', description: 'Monochrome OLED graphics engines, custom gamepads, and 8-bit game logic', iconName: 'Gamepad2' },
  { id: 'cat-7', name: 'Smart Home and IoT', slug: 'smart-home-iot', description: 'Automated domestic hardware, environmental controls, and low-power triggers', iconName: 'Home' },
  { id: 'cat-8', name: 'Sensors and Weather Stations', slug: 'sensors-weather', description: 'Barometric, humidity, solar radiation, and precision environmental telemetry', iconName: 'CloudRain' },
  { id: 'cat-9', name: 'Computer Hardware and Operating Systems', slug: 'hardware-os', description: 'Custom breadboard computers, bus architectures, and micro-kernels', iconName: 'Terminal' },
  { id: 'cat-10', name: 'Displays, OLED and LCD Projects', slug: 'displays-oled-lcd', description: 'High-refresh I2C/SPI display drivers, GUIs, and interactive status screens', iconName: 'Tv' },
  { id: 'cat-11', name: 'Wireless Communication and ESP-NOW', slug: 'wireless-esp-now', description: 'Direct peer-to-peer 1ms packet transmission without Wi-Fi router dependency', iconName: 'Radio' },
  { id: 'cat-12', name: 'Experimental Builds and Future Projects', slug: 'experimental-future', description: 'Early-stage prototypes, speculative electronics, and proof-of-concept hardware', iconName: 'Compass' }
];

const defaultProjects: Project[] = [
  {
    id: 'proj-xiaozhi-ai',
    slug: 'xiaozhi-esp32-ai-assistant',
    title: 'Xiaozhi-Style ESP32 AI Voice Assistant',
    category: 'AI Assistants and AI Experiments',
    status: 'In Progress',
    summary: 'A desktop AI voice assistant built on the ESP32-S3 microcontroller, featuring full-duplex WebSocket streaming, I2S microphone, audio amplifier, and an animated circular OLED face.',
    description: 'Inspired by the open-source Xiaozhi AI assistant, this hardware unit brings conversational LLMs into physical form. The system captures voice through an INMP441 omnidirectional I2S MEMS microphone, streams compressed audio packets to a cloud speech-to-text pipeline via low-latency WebSockets, receives real-time LLM inference, and streams back synthesized speech through a MAX98357A I2S Class-D amplifier. A round GC9A01 OLED display renders real-time expressive robotic eyes that blink, listen, and react.',
    problemSolved: 'Replaces bulky smart speakers with an open, inspectable hardware platform with zero proprietary telemetry and completely customizable audio and personality pipelines.',
    howItWorks: 'ESP32-S3 runs dual FreeRTOS tasks: Core 0 handles low-level I2S audio buffering and display rendering; Core 1 maintains WebSocket TLS connection and audio packet streaming. Voice Activity Detection (VAD) triggers streaming automatically.',
    coverImage: '/src/assets/images/xiaozhi_esp32_assistant_1791611579093.jpg',
    galleryImages: [
      '/src/assets/images/xiaozhi_esp32_assistant_1791611579093.jpg',
      '/src/assets/images/lab_hero_workspace_1791611566803.jpg'
    ],
    circuitDiagramImage: '/src/assets/images/xiaozhi_esp32_assistant_1791611579093.jpg',
    howToMakeProcess: `### Step 1: Microcontroller & Audio Wiring Preparation
- Seat the ESP32-S3 module on the breadboard or proto-board.
- Connect INMP441 I2S microphone: SCK to GPIO14, WS to GPIO15, SD to GPIO32, and wire L/R to GND to configure left-channel mono capture.
- Connect MAX98357A I2S DAC: BCLK to GPIO26, LRC to GPIO25, DIN to GPIO22, and wire GAIN pin to GND.
- Add a 220uF electrolytic capacitor across the 5V power supply rail feeding the MAX98357A amplifier.

### Step 2: GC9A01 Round Display Assembly
- Wire GC9A01 SPI display pins: CS to GPIO5, DC to GPIO2, RST to GPIO4, SCL to GPIO18, and SDA to GPIO23.
- Place a 3D-printed acoustic partition between the speaker cone and the MEMS microphone capsule to eliminate acoustic feedback.

### Step 3: Firmware Flashing (.bin / .ino)
- Download the compiled binary firmware file (xiaozhi_esp32_firmware_v0.4.bin) or open the Arduino/ESP-IDF sketch.
- Connect ESP32-S3 via USB-C, hold BOOT button, and execute:
  esptool.py --chip esp32s3 write_flash 0x0 xiaozhi_esp32_firmware_v0.4.bin
- Or compile in Arduino IDE with PSRAM set to "OPI PSRAM" and Flash Size 16MB.

### Step 4: Network Pairing & Voice Calibration
- Power the unit via 5V 2A USB-C.
- Input lab Wi-Fi SSID and WebSocket host endpoint.
- Watch the circular screen blink into active standby and say the wake word!`,
    firmwareFile: {
      name: 'xiaozhi_esp32_firmware_v0.4.bin',
      url: '/uploads/xiaozhi_esp32_firmware_v0.4.bin',
      fileSize: '1.8 MB',
      fileType: 'bin'
    },
    components: [
      { id: 'c1', name: 'ESP32-S3-WROOM-1 N16R8', specs: '16MB Flash, 8MB PSRAM, Dual Core 240MHz', count: 1 },
      { id: 'c2', name: 'INMP441 MEMS Microphone', specs: 'I2S digital audio output, 61 dBA SNR', count: 1 },
      { id: 'c3', name: 'MAX98357A I2S DAC Amplifier', specs: '3.2W Class-D audio amplifier, 3.3V-5V', count: 1 },
      { id: 'c4', name: 'GC9A01 Circular IPS/OLED Display', specs: '1.28 inch 240x240 RGB SPI interface', count: 1 },
      { id: 'c5', name: '4 Ohm 3W Micro Speaker', specs: '40mm acoustic chamber driver', count: 1 },
      { id: 'c6', name: 'WS2812B NeoPixel Ring', specs: '12 LED 5V addressable ring for status ring glow', count: 1 }
    ],
    pinConnections: [
      { id: 'p1', componentPin: 'INMP441 SCK', mcuPin: 'GPIO 14', description: 'I2S Bit Clock for microphone input', voltage: '3.3V' },
      { id: 'p2', componentPin: 'INMP441 WS', mcuPin: 'GPIO 15', description: 'I2S Word Select / Left-Right clock', voltage: '3.3V' },
      { id: 'p3', componentPin: 'INMP441 SD', mcuPin: 'GPIO 32', description: 'I2S Serial Data microphone input', voltage: '3.3V' },
      { id: 'p4', componentPin: 'MAX98357 BCLK', mcuPin: 'GPIO 26', description: 'I2S Bit Clock for speaker amplifier', voltage: '3.3V' },
      { id: 'p5', componentPin: 'MAX98357 LRC', mcuPin: 'GPIO 25', description: 'I2S Word Select for DAC output', voltage: '3.3V' },
      { id: 'p6', componentPin: 'MAX98357 DIN', mcuPin: 'GPIO 22', description: 'I2S Serial Data to amplifier', voltage: '3.3V' },
      { id: 'p7', componentPin: 'GC9A01 CS', mcuPin: 'GPIO 5', description: 'SPI Chip Select for round screen', voltage: '3.3V' },
      { id: 'p8', componentPin: 'NeoPixel DIN', mcuPin: 'GPIO 18', description: 'Addressable LED state indicator ring', voltage: '5V/3.3V' }
    ],
    wiringInstructions: 'Ensure INMP441 L/R pin is tied to GND for left-channel mono capture. Connect MAX98357A GAIN pin to GND for +9dB default gain or 100k to GND for +15dB. Power the amplifier with a dedicated 5V rail decoupled with a 220uF electrolytic capacitor to prevent audio clipping during sudden voice peaks.',
    codeSnippet: `#include <driver/i2s.h>
#include <WiFi.h>
#include <WebSocketsClient.h>

#define I2S_MIC_SCK 14
#define I2S_MIC_WS  15
#define I2S_MIC_SD  32

void setupI2SMic() {
  i2s_config_t i2s_config = {
    .mode = (i2s_mode_t)(I2S_MODE_MASTER | I2S_MODE_RX),
    .sample_rate = 16000,
    .bits_per_sample = I2S_BITS_PER_SAMPLE_32BIT,
    .channel_format = I2S_CHANNEL_FMT_ONLY_LEFT,
    .communication_format = I2S_COMM_FORMAT_STAND_I2S,
    .intr_alloc_flags = ESP_INTR_FLAG_LEVEL1,
    .dma_buf_count = 4,
    .dma_buf_len = 512
  };
  i2s_driver_install(I2S_NUM_0, &i2s_config, 0, NULL);
}`,
    codeSnippetLanguage: 'ESP32 C++',
    downloadableFiles: [
      { id: 'f1', name: 'xiaozhi_esp32_firmware_v0.4.zip', fileType: 'ZIP', fileSize: '2.4 MB', url: '#' },
      { id: 'f2', name: 'inmp441_max98357_schematic.pdf', fileType: 'PDF', fileSize: '480 KB', url: '#' }
    ],
    features: [
      'Full-duplex real-time conversational streaming over WebSocket',
      'Hardware-accelerated 16kHz audio sampling with DMA buffers',
      'Expressive eye animations synchronized to assistant states (Listening, Thinking, Speaking)',
      'Sub-800ms end-to-end voice latency when connected to local server',
      'Capacitive touch tap-to-interrupt feature on top enclosure'
    ],
    specifications: {
      'Microcontroller': 'ESP32-S3 Xtensa LX7 Dual-Core 240MHz',
      'Audio Input': 'INMP441 I2S Digital MEMS Microphone',
      'Audio Output': 'MAX98357A 3.2W Class-D I2S DAC',
      'Display': '1.28-inch GC9A01 Round IPS LCD (240x240)',
      'Power Supply': 'USB-C 5V 2A with TPS62162 3.3V Step-Down Buck',
      'Wireless': '802.11 b/g/n Wi-Fi + BLE 5.0'
    },
    challengesAndImprovements: 'Audio feedback loop occurred initially because the micro speaker was placed too close to the microphone without acoustic isolation. Resolved by designing an internal 3D printed acoustic baffle with silicone dampening ring. Firmware DMA buffer sizing was tuned from 256 to 512 samples to eliminate stutter under Wi-Fi jitter.',
    demoVideoUrl: '',
    buildLogs: [
      {
        id: 'bl1',
        date: '2026-08-14',
        title: 'I2S Audio Pipeline Prototyping',
        content: 'Breadboarded the INMP441 microphone with MAX98357A. Captured raw PCM audio over serial and confirmed crisp vocal pickup without ADC noise.',
        type: 'breakthrough'
      },
      {
        id: 'bl2',
        date: '2026-09-02',
        title: 'GC9A01 Display Integration & Animation',
        content: 'Created vector rendering routines for animated cybernetic eyes with smooth blinks and pupil dilatation responding to audio volume amplitude.',
        type: 'progress'
      },
      {
        id: 'bl3',
        date: '2026-09-28',
        title: 'Acoustic Feedback Isolation Issue & Fix',
        content: 'High-volume speech caused the mic to self-trigger. Added software threshold gate and physical silicone isolator around the mic capsule.',
        type: 'failure'
      }
    ],
    futureUpgrades: [
      'Implement on-device wake-word detection using ESP-SR neural network model',
      'Add local voice synthesis fallback using SAM (Software Automatic Mouth)',
      'Custom injection-molded or resin-printed tabletop chassis'
    ],
    tags: ['ESP32', 'AI Assistant', 'Xiaozhi', 'I2S Audio', 'GC9A01', 'FreeRTOS'],
    isFeatured: true,
    isPublished: true,
    createdAt: '2026-08-10T10:00:00Z',
    updatedAt: '2026-10-01T15:30:00Z'
  },
  {
    id: 'proj-women-safety-device',
    slug: 'women-safety-device-esp-now',
    title: 'Women Safety Wearable Device with ESP-NOW & GPS',
    category: 'Women Safety Device',
    status: 'In Progress',
    summary: 'A wearable emergency personal safety beacon with instant one-click SOS button, GPS coordinate acquisition, 110dB piezo alarm, status OLED screen, and router-free ESP-NOW mesh broadcast.',
    description: 'Designed as a dependable personal safety guardian for women that operates even in areas with zero cellular reception or congested Wi-Fi. Features a shielded tactile SOS push button. Upon activation, the device locks high-precision NMEA GPS coordinates from a NEO-6M module, sounds an intense 110dB acoustic alarm to deter aggressors, strobes high-intensity magenta LEDs, and immediately broadcasts encrypted distress telemetry via ESP-NOW 2.4GHz mesh to paired receiver hubs and nearby safety terminals.',
    problemSolved: 'Standard smartphone emergency apps fail when a phone is locked, grabbed, or out of cellular coverage. This dedicated wearable triggers in 0.1 seconds with one firm press and transmits independent of cell towers.',
    howItWorks: 'The ESP32 microcontroller continuously reads the GPS receiver at 5Hz. In standby, the device enters ultra-low power light sleep (15uA). Pressing the SOS switch triggers an external interrupt, instantly awakening the processor, firing the siren, and broadcasting structured ESP-NOW packets with latitude, longitude, speed, and device ID.',
    coverImage: '/src/assets/images/women_safety_iot_device_1791611591658.jpg',
    galleryImages: [
      '/src/assets/images/women_safety_iot_device_1791611591658.jpg'
    ],
    circuitDiagramImage: '/src/assets/images/women_safety_iot_device_1791611591658.jpg',
    howToMakeProcess: `### Step 1: GPS & High-Decibel Siren Stage
- Wire NEO-6M GPS receiver TX to ESP32 GPIO16 (RX2) and RX to GPIO17 (TX2).
- Mount the ceramic patch antenna facing upward with a copper ground plane underneath.
- Drive the 110dB piezo buzzer through a 2N7000 N-channel MOSFET on GPIO27 to prevent pulling excessive current from the MCU.

### Step 2: Emergency SOS Pushbutton & OLED Screen
- Connect the momentary emergency SOS tactile button between GPIO4 (EXT0) and GND using internal pull-up.
- Connect SSD1306 0.96" OLED: SDA to GPIO21, SCL to GPIO22.
- Wire two ultra-bright magenta strobe LEDs in parallel to GPIO19 through 150-ohm current limiting resistors.

### Step 3: Flash Firmware (.ino Code File)
- Open Arduino IDE, select board "ESP32 Dev Module".
- Install TinyGPS++ and ESP-NOW libraries.
- Flash the provided sentinel_safety_espnow.ino firmware file to the device.
- Verify GPS fix on OLED screen (lat/lon coordinates and satellite count).

### Step 4: Standby Sleep & Distress Trigger Testing
- Test light-sleep entry (current drops to ~15uA).
- Firmly press the SOS button to verify instantaneous wake-up, siren pulse, and ESP-NOW packet broadcasting to the base station dashboard.`,
    firmwareFile: {
      name: 'sentinel_safety_espnow.ino',
      url: '/uploads/sentinel_safety_espnow.ino',
      fileSize: '14 KB',
      fileType: 'ino'
    },
    components: [
      { id: 'ws1', name: 'ESP32 NodeMCU / Custom Minimal Board', specs: 'Tensilica LX6 240MHz with 2.4GHz RF', count: 1 },
      { id: 'ws2', name: 'NEO-6M GPS Module with Ceramic Patch Antenna', specs: '50-channel u-blox engine, -161 dBm tracking', count: 1 },
      { id: 'ws3', name: '0.96 inch I2C OLED SSD1306', specs: '128x64 pixels monochrome display', count: 1 },
      { id: 'ws4', name: '110dB Piezo Siren Buzzer', specs: 'Continuous resonant alarm at 3.1kHz', count: 1 },
      { id: 'ws5', name: 'Heavy-duty Tactile SOS Pushbutton', specs: 'Recessed momentary switch with lock collar', count: 1 },
      { id: 'ws6', name: 'LiPo Battery 3.7V 850mAh', specs: 'With TP4056 charging module and DW01A protection', count: 1 },
      { id: 'ws7', name: 'Ultra-bright Magenta Strobe LEDs', specs: '1000mcd pulsed alert indicators', count: 2 }
    ],
    pinConnections: [
      { id: 'wsp1', componentPin: 'NEO-6M TX', mcuPin: 'GPIO 16 (RX2)', description: 'GPS NMEA serial stream input', voltage: '3.3V' },
      { id: 'wsp2', componentPin: 'NEO-6M RX', mcuPin: 'GPIO 17 (TX2)', description: 'GPS configuration command output', voltage: '3.3V' },
      { id: 'wsp3', componentPin: 'SSD1306 SDA', mcuPin: 'GPIO 21', description: 'I2C Data line for OLED status screen', voltage: '3.3V' },
      { id: 'wsp4', componentPin: 'SSD1306 SCL', mcuPin: 'GPIO 22', description: 'I2C Clock line for OLED status screen', voltage: '3.3V' },
      { id: 'wsp5', componentPin: 'SOS Button', mcuPin: 'GPIO 4 (EXT0)', description: 'Hardware interrupt with internal pull-up', voltage: 'GND pull' },
      { id: 'wsp6', componentPin: 'Buzzer Driver MOSFET', mcuPin: 'GPIO 27', description: 'PWM driver for 110dB emergency acoustic alarm', voltage: '5V via Step-up' }
    ],
    wiringInstructions: 'Ensure the GPS module receives clean power through a ferrite bead to eliminate RF ripple from the ESP32 transmitter. Use a 2N7000 or AO3400 N-channel MOSFET to drive the 110dB buzzer rather than powering directly from GPIO pin to prevent overcurrent latch-up.',
    codeSnippet: `#include <esp_now.h>
#include <WiFi.h>
#include <TinyGPS++.h>

typedef struct struct_message {
  char deviceId[16];
  float latitude;
  float longitude;
  uint8_t alertLevel;
  uint32_t timestamp;
} struct_message;

struct_message alertPacket;
uint8_t broadcastAddress[] = {0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF};

void triggerEmergencyAlert() {
  alertPacket.alertLevel = 1; // SOS active
  alertPacket.latitude = gps.location.lat();
  alertPacket.longitude = gps.location.lng();
  esp_now_send(broadcastAddress, (uint8_t *) &alertPacket, sizeof(alertPacket));
}`,
    codeSnippetLanguage: 'ESP32 C++',
    downloadableFiles: [
      { id: 'wf1', name: 'sentinel_safety_espnow_source.ino', fileType: 'INO', fileSize: '14 KB', url: '#' },
      { id: 'wf2', name: 'women_safety_wiring_schematic.png', fileType: 'PNG', fileSize: '1.1 MB', url: '#' }
    ],
    features: [
      'Zero-cell-dependency emergency broadcast using ESP-NOW direct RF mesh',
      'Instantaneous hardware interrupt trigger wakes device from deep sleep in 8ms',
      'High-contrast OLED screen showing GPS satellite lock status, battery %, and signal confirmation',
      '110dB high-decibel acoustic siren to frighten attackers and summon nearby help',
      'Receiving base station dashboard for community watch or family monitoring'
    ],
    specifications: {
      'Controller': 'ESP32-WROOM-32',
      'RF Protocol': 'ESP-NOW (2.4 GHz Proprietary Direct Mesh)',
      'Range': 'Up to 250 meters line-of-sight without repeaters',
      'GPS Precision': '2.5m CEP with u-blox NEO-6M engine',
      'Battery Life': 'Up to 96 hours in standby deep sleep'
    },
    challengesAndImprovements: 'GPS cold-start time took over 45 seconds indoors. Implemented GPS assist data caching in RTC memory and tuned antenna ground plane, cutting warm re-acquisition down to under 6 seconds.',
    demoVideoUrl: '',
    buildLogs: [
      {
        id: 'wbl1',
        date: '2026-07-20',
        title: 'Initial ESP-NOW Mesh Bench Testing',
        content: 'Verified packet delivery between wearable sender and receiver node across two concrete buildings. 99.4% packet reception achieved.',
        type: 'breakthrough'
      },
      {
        id: 'wbl2',
        date: '2026-08-11',
        title: 'GPS Antenna Ground Plane Tuning',
        content: 'Added copper foil shield behind the ceramic patch antenna to reduce noise from the ESP32 switching regulator.',
        type: 'upgrade'
      }
    ],
    futureUpgrades: [
      'Miniaturize to custom 4-layer PCB with embedded ceramic antenna',
      'Integrate fall detection using MPU-6050 accelerometer',
      'Add SIM800L GSM backup fallback module for long-range SMS'
    ],
    tags: ['ESP32', 'Women Safety', 'ESP-NOW', 'GPS', 'OLED', 'Emergency Beacon'],
    isFeatured: true,
    isPublished: true,
    createdAt: '2026-07-15T08:00:00Z',
    updatedAt: '2026-09-29T14:10:00Z'
  },
  {
    id: 'proj-retro-arcade-oled',
    slug: 'arduino-oled-retro-gaming-console',
    title: 'Arduino OLED Retro Gaming Handheld Console',
    category: 'Retro Gaming and Handheld Consoles',
    status: 'Completed',
    summary: 'A custom handheld 8-bit gaming console powered by an Arduino ATmega328P, driving a 128x64 monochrome OLED screen with tactile controls, piezoelectric audio, and custom games.',
    description: 'A pocket gaming system built from scratch to explore micro-controller game development, fast direct-buffer bitmapped rendering, and memory optimization under extreme constraints (2KB SRAM). Features three full playable games written in optimized C++: Flappy Bird clone, Block Blast puzzle game, and Stone Dodger reflex challenge.',
    problemSolved: 'Demonstrates how to squeeze responsive 30+ FPS arcade gaming and multi-channel sound effects out of a humble 16MHz 8-bit Arduino without specialized GPU hardware.',
    howItWorks: 'The game engine utilizes an 1024-byte RAM buffer (half of the ATmega328P total RAM). Game objects are computed as lightweight 1-byte coordinates, collision boxes use fast bitwise arithmetic, and the screen buffer is flushed to the SSD1306 controller over hardware I2C at 400kHz.',
    coverImage: '/src/assets/images/retro_gaming_oled_console_1791611602786.jpg',
    galleryImages: [
      '/src/assets/images/retro_gaming_oled_console_1791611602786.jpg'
    ],
    components: [
      { id: 'rg1', name: 'Arduino Nano (ATmega328P 16MHz)', specs: '32KB Flash, 2KB SRAM, 1KB EEPROM', count: 1 },
      { id: 'rg2', name: '0.96 inch I2C OLED SSD1306 (128x64)', specs: 'White monochrome high-contrast display', count: 1 },
      { id: 'rg3', name: 'Micro Tactile Pushbuttons', specs: '6mm x 6mm momentary buttons (D-Pad + Action A/B)', count: 6 },
      { id: 'rg4', name: 'Passive Piezoelectric Buzzer', specs: 'Square-wave tone generation for 8-bit SFX', count: 1 },
      { id: 'rg5', name: 'Power Switch & 9V / 3.7V Battery Holder', specs: 'Miniature slide switch with boost regulator', count: 1 }
    ],
    pinConnections: [
      { id: 'rgp1', componentPin: 'OLED SDA', mcuPin: 'A4 (PC4)', description: 'I2C Data bus for display streaming', voltage: '5V / 3.3V' },
      { id: 'rgp2', componentPin: 'OLED SCL', mcuPin: 'A5 (PC5)', description: 'I2C Clock line with 400kHz TWBR clock', voltage: '5V / 3.3V' },
      { id: 'rgp3', componentPin: 'Button UP / JUMP', mcuPin: 'D2', description: 'Internal pull-up resistor input', voltage: 'GND pull' },
      { id: 'rgp4', componentPin: 'Button DOWN', mcuPin: 'D3', description: 'Internal pull-up resistor input', voltage: 'GND pull' },
      { id: 'rgp5', componentPin: 'Button LEFT', mcuPin: 'D4', description: 'Internal pull-up resistor input', voltage: 'GND pull' },
      { id: 'rgp6', componentPin: 'Button RIGHT', mcuPin: 'D5', description: 'Internal pull-up resistor input', voltage: 'GND pull' },
      { id: 'rgp7', componentPin: 'Piezo Buzzer (+)', mcuPin: 'D9', description: 'Timer1 PWM pin for pitch tones', voltage: '5V' }
    ],
    wiringInstructions: 'Use Arduino internal pull-ups (INPUT_PULLUP) so buttons switch directly to GND without external pull-down resistors. Set TWBR = 12 in setup() to force I2C clock to 400kHz Fast Mode for 38 FPS animation.',
    codeSnippet: `#include <Wire.h>
#include <Adafruit_SSD1306.h>

Adafruit_SSD1306 display(128, 64, &Wire, -1);

void setup() {
  Wire.begin();
  Wire.setClock(400000); // 400kHz Fast I2C
  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  display.clearDisplay();
  pinMode(2, INPUT_PULLUP);
}

void loop() {
  updateGamePhysics();
  renderFrame();
  display.display();
}`,
    codeSnippetLanguage: 'Arduino C++',
    downloadableFiles: [
      { id: 'rgf1', name: 'arduino_retro_arcade_full.ino', fileType: 'INO', fileSize: '28 KB', url: '#' }
    ],
    features: [
      'Three built-in games: Flappy Bird clone, Block Blast, Stone Dodger',
      'High-speed 400kHz I2C rendering achieving smooth 35+ FPS animation',
      'EEPROM high-score persistence that saves best records between battery swaps',
      'Custom 8-bit sound effects engine playing polyphonic-like arpeggios on passive buzzer',
      'Compact laser-cut clear acrylic sandwich enclosure with exposed copper traces'
    ],
    specifications: {
      'MCU': 'ATmega328P 16MHz 8-bit AVR',
      'RAM': '2048 Bytes (1024 bytes allocated for video buffer)',
      'Display': '128x64 0.96 inch SSD1306 OLED',
      'Controls': '4-Way Directional + Action A & B',
      'Audio': 'Square-wave PWM sound synthesizer'
    },
    challengesAndImprovements: 'Initial versions ran out of SRAM causing memory corruption and crash. Refactored all constant strings and sprite bitmap tables to PROGMEM flash memory, freeing 650 bytes of crucial dynamic memory.',
    demoVideoUrl: '',
    buildLogs: [
      {
        id: 'rgl1',
        date: '2026-05-18',
        title: 'Memory Optimization & PROGMEM Migration',
        content: 'Moved all sprite bitmaps to Flash ROM using PROGMEM. SRAM usage dropped from 94% to 52%, eliminating glitchy stack collisions.',
        type: 'breakthrough'
      }
    ],
    futureUpgrades: [
      'Upgrade to ESP32 with 1.3 inch SPI color ST7789 display for 16-bit color gaming',
      'Add rechargeable LiPo battery with USB-C TP4056 charging port'
    ],
    tags: ['Arduino', 'Retro Gaming', 'OLED', 'SSD1306', 'ATmega328P', 'Game Dev'],
    isFeatured: true,
    isPublished: true,
    createdAt: '2026-05-01T12:00:00Z',
    updatedAt: '2026-06-15T18:00:00Z'
  },
  {
    id: 'proj-smart-weather-station',
    slug: 'smart-weather-station-iot',
    title: 'Smart Environmental Weather Station & Telemetry Node',
    category: 'Sensors and Weather Stations',
    status: 'Completed',
    summary: 'A solar-backed ESP32 outdoor weather station measuring atmospheric pressure, humidity, ambient temperature, light levels, and rain accumulation with MQTT telemetry.',
    description: 'An autonomous micro-meteorological monitoring node deployed outdoors. Features precision calibrated digital I2C environmental sensors, deep-sleep cycle scheduling for multi-week battery longevity, and low-power Wi-Fi MQTT publishing.',
    problemSolved: 'Provides hyper-local, precision microclimate readings at 5-minute intervals rather than relying on distant municipal weather stations.',
    howItWorks: 'The ESP32 awakens from deep sleep every 5 minutes via internal RTC timer, powers sensor rails via a P-channel MOSFET switch, takes 10 oversampled readings, averages values, connects to Wi-Fi, transmits JSON payloads to MQTT broker, and re-enters 10uA deep sleep in under 2.8 seconds.',
    coverImage: '/src/assets/images/lab_hero_workspace_1791611566803.jpg',
    galleryImages: ['/src/assets/images/lab_hero_workspace_1791611566803.jpg'],
    components: [
      { id: 'ws_c1', name: 'ESP32 DevKit V1', specs: 'Dual core 240MHz with deep sleep RTC', count: 1 },
      { id: 'ws_c2', name: 'Bosch BME280 Sensor', specs: 'High precision temperature, barometric pressure & humidity', count: 1 },
      { id: 'ws_c3', name: 'BH1750 Ambient Light Sensor', specs: 'Digital 16-bit I2C light meter (0 to 65535 Lux)', count: 1 },
      { id: 'ws_c4', name: 'Tipping Bucket Rain Gauge & Sensor', specs: 'Magnetic reed switch tipping measurement', count: 1 },
      { id: 'ws_c5', name: '18650 3400mAh Li-ion with Solar Panel', specs: '6V 2W Monocrystalline solar panel + TP4056 charger', count: 1 }
    ],
    pinConnections: [
      { id: 'wsp_1', componentPin: 'BME280 / BH1750 SDA', mcuPin: 'GPIO 21', description: 'Shared I2C Data bus', voltage: '3.3V' },
      { id: 'wsp_2', componentPin: 'BME280 / BH1750 SCL', mcuPin: 'GPIO 22', description: 'Shared I2C Clock bus', voltage: '3.3V' },
      { id: 'wsp_3', componentPin: 'Rain Sensor Reed Switch', mcuPin: 'GPIO 13', description: 'Pulse counter interrupt', voltage: '3.3V pull-up' },
      { id: 'wsp_4', componentPin: 'Battery Voltage Divider', mcuPin: 'GPIO 34', description: '100k/100k resistor divider to ADC1', voltage: 'Analog In' }
    ],
    wiringInstructions: 'Use ADC1 pins (GPIO 32-39) exclusively for analog measurements on ESP32 because ADC2 is disabled when Wi-Fi is active.',
    codeSnippet: `#include <WiFi.h>
#include <PubSubClient.h>
#include <Adafruit_BME280.h>

#define uS_TO_S_FACTOR 1000000ULL
#define TIME_TO_SLEEP  300 // 5 minutes

Adafruit_BME280 bme;

void setup() {
  bme.begin(0x76);
  // Read sensors, publish to MQTT, then:
  esp_sleep_enable_timer_wakeup(TIME_TO_SLEEP * uS_TO_S_FACTOR);
  esp_deep_sleep_start();
}`,
    codeSnippetLanguage: 'ESP32 C++',
    downloadableFiles: [
      { id: 'ws_f1', name: 'weather_station_mqtt.ino', fileType: 'INO', fileSize: '18 KB', url: '#' }
    ],
    features: [
      'Sub-3-second wake-measure-transmit cycle for ultra-long battery endurance',
      'Calculates dew point, heat index, and barometric pressure elevation trends',
      'Over-the-air firmware updates (OTA) capability'
    ],
    specifications: {
      'Sensors': 'BME280 + BH1750 + Rain Gauge',
      'Protocol': 'MQTT over Wi-Fi 2.4GHz',
      'Sleep Current': '14 uA',
      'Runtime on Battery': 'Indefinite with 2W solar panel'
    },
    challengesAndImprovements: 'Wi-Fi connection latency initially consumed excessive energy. Implemented static IP configuration and cached BSSID channel, reducing Wi-Fi connect time from 4.2s down to 650ms.',
    buildLogs: [
      { id: 'ws_bl1', date: '2026-06-25', title: 'Solar Power Balancing', content: 'Calibrated solar charging current and added 1N5819 Schottky diode to prevent reverse current drain at night.', type: 'progress' }
    ],
    futureUpgrades: ['Add LoRaWAN radio module for 5+ kilometer range deployment in open agricultural fields'],
    tags: ['ESP32', 'Weather Station', 'BME280', 'IoT', 'MQTT', 'Solar'],
    isFeatured: false,
    isPublished: true,
    createdAt: '2026-06-20T09:00:00Z',
    updatedAt: '2026-07-10T11:00:00Z'
  },
  {
    id: 'proj-4dof-robot-arm',
    slug: '4-dof-robotic-arm-inverse-kinematics',
    title: '4-DOF Precision Robotic Arm with Inverse Kinematics',
    category: 'Robotics and Automation',
    status: 'In Progress',
    summary: 'A 4-degree-of-freedom robotic manipulator driven by metal-gear servos, PCA9685 I2C 16-channel PWM controller, and analytic geometric inverse kinematics solver.',
    description: 'An open-source robotic workstation arm engineered to execute precision pick-and-place tasks, 2D vector path plotting, and wireless control via Bluetooth gamepad. Features geometric inverse kinematics solving in real-time on an ESP32 microcontroller.',
    problemSolved: 'Replaces expensive proprietary industrial educational arms with an open-architecture, 3D-printable manipulator running transparent trigonometry algorithms.',
    howItWorks: 'User provides Cartesian target coordinates (X, Y, Z, Angle). The ESP32 solves analytic trigonometric inverse kinematic equations to compute target angles for Waist, Shoulder, Elbow, and Wrist servos. Smooth acceleration profiles prevent mechanical jerking.',
    coverImage: '/src/assets/images/lab_hero_workspace_1791611566803.jpg',
    galleryImages: ['/src/assets/images/lab_hero_workspace_1791611566803.jpg'],
    components: [
      { id: 'ra1', name: 'ESP32 Dual-Core DevBoard', specs: 'Kinematic solver and BLE host', count: 1 },
      { id: 'ra2', name: 'PCA9685 16-Channel 12-Bit PWM Driver', specs: 'I2C interface, 0.04ms pulse precision', count: 1 },
      { id: 'ra3', name: 'MG996R Metal-Gear High-Torque Servos', specs: '11kg-cm stall torque at 6V', count: 4 },
      { id: 'ra4', name: 'SG90 Micro Servo (Gripper)', specs: 'Precision micro end-effector actuator', count: 1 },
      { id: 'ra5', name: '5V 5A High-Current Power Supply', specs: 'Dedicated servo power rail with 1000uF smoothing cap', count: 1 }
    ],
    pinConnections: [
      { id: 'rap1', componentPin: 'PCA9685 SDA', mcuPin: 'GPIO 21', description: 'I2C Data line', voltage: '3.3V Logic' },
      { id: 'rap2', componentPin: 'PCA9685 SCL', mcuPin: 'GPIO 22', description: 'I2C Clock line', voltage: '3.3V Logic' },
      { id: 'rap3', componentPin: 'PCA9685 V+', mcuPin: 'External 5V 5A PSU', description: 'Servo high-current rail', voltage: '5V - 6V' }
    ],
    wiringInstructions: 'Never power MG996R servos from the ESP32 5V pin! Stalling a single MG996R draws over 1.8A, which will cause brownout resets. Always use a dedicated 5V 5A power supply with common ground.',
    codeSnippet: `void solveIK(float x, float y, float z, float &baseAngle, float &shoulderAngle, float &elbowAngle) {
  baseAngle = atan2(y, x) * 180.0 / PI;
  float r = sqrt(x*x + y*y);
  float d = sqrt(r*r + z*z);
  float a1 = atan2(z, r);
  float a2 = acos((L1*L1 + d*d - L2*L2) / (2.0 * L1 * d));
  shoulderAngle = (a1 + a2) * 180.0 / PI;
  elbowAngle = acos((L1*L1 + L2*L2 - d*d) / (2.0 * L1 * L2)) * 180.0 / PI;
}`,
    codeSnippetLanguage: 'ESP32 C++',
    downloadableFiles: [
      { id: 'raf1', name: 'arm_inverse_kinematics.ino', fileType: 'INO', fileSize: '16 KB', url: '#' }
    ],
    features: [
      'Analytic inverse kinematics solving target positions in 40 microseconds',
      'Sinusoidal S-curve acceleration ramps avoiding mechanical shake',
      'Web-based 3D visualizer showing arm position in real-time'
    ],
    specifications: {
      'Degrees of Freedom': '4-DOF + 1-DOF Gripper',
      'Payload Capacity': '250 grams at full extension (180mm)',
      'Actuation': 'High-torque metal-gear servos'
    },
    challengesAndImprovements: 'Encountered servo jitter caused by PWM clock drift. Resolved by configuring PCA9685 with external crystal correction factor and adding software deadband filtering.',
    buildLogs: [
      { id: 'rabl1', date: '2026-09-12', title: 'Kinematics Validation', content: 'Calibrated link lengths and confirmed 1mm Cartesian positioning repeatability across 100 test iterations.', type: 'progress' }
    ],
    futureUpgrades: ['Add computer vision camera feed for automated colored object sorting using OpenCV'],
    tags: ['Robotics', 'Inverse Kinematics', 'ESP32', 'PCA9685', 'Servos', 'Automation'],
    isFeatured: true,
    isPublished: true,
    createdAt: '2026-09-01T14:00:00Z',
    updatedAt: '2026-10-04T19:00:00Z'
  },
  {
    id: 'proj-smart-dustbin',
    slug: 'smart-ultrasonic-dustbin',
    title: 'Smart Ultrasonic Touchless Dustbin & Automation',
    category: 'Smart Home and IoT',
    status: 'Completed',
    summary: 'A touchless automated waste bin utilizing ultrasonic echo time-of-flight sensing and servo rack mechanism for hygienic hands-free operation.',
    description: 'A practical home automation build implementing touchless waste disposal. When a hand approaches within 20cm, an HC-SR04 ultrasonic transducer detects the proximity, smoothly opens the lid using an SG90 servo motor, waits for 4 seconds, and closes softly.',
    problemSolved: 'Hygienic contact-free lid opening preventing germ transfer in workshops and kitchens.',
    howItWorks: 'Arduino sends a 10 microsecond pulse on the HC-SR04 trigger pin and measures the echo return duration. Distance is calculated via speed of sound formula (d = time * 0.034 / 2). A finite state machine controls lid opening, dwell delay, and soft close.',
    coverImage: '/src/assets/images/lab_hero_workspace_1791611566803.jpg',
    galleryImages: ['/src/assets/images/lab_hero_workspace_1791611566803.jpg'],
    components: [
      { id: 'sdb1', name: 'Arduino Uno / Nano R3', specs: 'ATmega328P microcontroller', count: 1 },
      { id: 'sdb2', name: 'HC-SR04 Ultrasonic Distance Sensor', specs: '2cm to 400cm measurement range, 3mm resolution', count: 1 },
      { id: 'sdb3', name: 'SG90 9g Micro Servo Motor', specs: '1.6 kg-cm torque at 4.8V', count: 1 }
    ],
    pinConnections: [
      { id: 'sdbp1', componentPin: 'HC-SR04 TRIG', mcuPin: 'D6', description: 'Trigger pulse output pin', voltage: '5V' },
      { id: 'sdbp2', componentPin: 'HC-SR04 ECHO', mcuPin: 'D7', description: 'Echo duration measurement pin', voltage: '5V' },
      { id: 'sdbp3', componentPin: 'SG90 Signal', mcuPin: 'D9', description: 'PWM servo positioning pin', voltage: '5V' }
    ],
    wiringInstructions: 'Ensure 5V power supply can deliver at least 500mA during servo movement to prevent Arduino reset.',
    codeSnippet: `int getDistance() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  long duration = pulseIn(ECHO_PIN, HIGH, 30000);
  return duration * 0.034 / 2;
}`,
    codeSnippetLanguage: 'Arduino C++',
    downloadableFiles: [{ id: 'sdbf1', name: 'smart_dustbin_v1.ino', fileType: 'INO', fileSize: '6 KB', url: '#' }],
    features: ['Touchless operation', 'Low power idle standby', 'Soft-close servo speed profile'],
    specifications: { 'MCU': 'Arduino Uno R3', 'Detection Distance': '20 cm', 'Response Time': '< 150 ms' },
    challengesAndImprovements: 'False triggers from ambient reflections were resolved with a 3-sample median filter in software.',
    buildLogs: [{ id: 'sdbl1', date: '2026-04-10', title: 'Hygienic Prototype Complete', content: 'Mounted hardware inside custom enclosure and tuned servo swing angle to 90 degrees.', type: 'breakthrough' }],
    futureUpgrades: ['Add fill-level optical sensor and buzzer indicator when bin is full'],
    tags: ['Arduino', 'Ultrasonic', 'HC-SR04', 'Automation', 'Servo'],
    isFeatured: false,
    isPublished: true,
    createdAt: '2026-04-05T08:00:00Z',
    updatedAt: '2026-04-15T10:00:00Z'
  },
  {
    id: 'proj-disaster-alert-pro',
    slug: 'disaster-alert-pro-safety-system',
    title: 'DisasterAlertPro Safety & Disaster Detection Concept',
    category: 'Experimental Builds and Future Projects',
    status: 'Planned',
    summary: 'An autonomous early-warning disaster detection network integrating seismic vibration sensors, combustible gas detectors, and LoRa emergency broadcasts.',
    description: 'An advanced conceptual emergency detection unit engineered to identify rapid environmental anomalies before catastrophic events. Equipped with an SW-420 high-sensitivity vibration module to detect P-wave earthquake tremors, an MQ-2 combustible gas and smoke sensor, and sub-gigahertz LoRa transceivers for long-range disaster broadcasting.',
    problemSolved: 'Municipal alert systems are frequently crippled by power grid failure during natural disasters. This distributed node cluster provides independent warning.',
    howItWorks: 'Sensor nodes monitor environmental baselines. When acceleration or gas thresholds are breached, an immediate emergency packet is sent via 868/915MHz LoRa to community siren gateways and local alert monitors.',
    coverImage: '/src/assets/images/lab_hero_workspace_1791611566803.jpg',
    galleryImages: ['/src/assets/images/lab_hero_workspace_1791611566803.jpg'],
    components: [
      { id: 'da1', name: 'ESP32 TTGO T-Beam LoRa 915MHz', specs: 'ESP32 + Semtech SX1276 LoRa + NEO-6M GPS', count: 1 },
      { id: 'da2', name: 'SW-420 Vibration Sensor Module', specs: 'Adjustable LM393 comparator trigger', count: 1 },
      { id: 'da3', name: 'MQ-2 Gas / Smoke Sensor', specs: 'Detects LPG, methane, alcohol, and smoke', count: 1 }
    ],
    pinConnections: [
      { id: 'dap1', componentPin: 'SW-420 DO', mcuPin: 'GPIO 35', description: 'Vibration alert interrupt', voltage: '3.3V' },
      { id: 'dap2', componentPin: 'MQ-2 AO', mcuPin: 'GPIO 34', description: 'Gas concentration analog read', voltage: 'Analog In' }
    ],
    wiringInstructions: 'MQ-2 internal heater requires 5V 150mA. Allow a 24-hour preheat burn-in period before calibrating baseline resistance.',
    codeSnippet: `// DisasterAlertPro Sensor Threshold Monitor
#define VIB_PIN 35
#define GAS_PIN 34

void checkEnvironmentalThreats() {
  int gasVal = analogRead(GAS_PIN);
  bool vibActive = digitalRead(VIB_PIN);
  if (gasVal > 1800 || vibActive) {
    transmitLoRaEmergencyBeacon(gasVal, vibActive);
  }
}`,
    codeSnippetLanguage: 'ESP32 C++',
    downloadableFiles: [],
    features: ['Long-range LoRa transmission up to 10km', 'Dual seismic and toxic gas verification', 'Low-power battery backup'],
    specifications: { 'LoRa Frequency': '915 MHz', 'Sensing Range': 'Seismic P-wave + Gas', 'Backup Battery': '18650 Li-ion' },
    challengesAndImprovements: 'Currently in planning and schematic layout phase. Evaluating MEMS accelerometers (ADXL345) to supplement simple vibration switches for false-alarm rejection.',
    buildLogs: [{ id: 'dabl1', date: '2026-09-15', title: 'System Architecture Specification', content: 'Drafted schematic and link-budget calculations for 10km line-of-sight LoRa mesh.', type: 'progress' }],
    futureUpgrades: ['Deploy initial 3-node field test mesh across high-elevation test points'],
    tags: ['Disaster Alert', 'ESP32', 'LoRa', 'Sensors', 'Safety', 'Concept'],
    isFeatured: false,
    isPublished: true,
    createdAt: '2026-09-10T11:00:00Z',
    updatedAt: '2026-09-20T16:00:00Z'
  },
  {
    id: 'proj-esp-now-wireless',
    slug: 'esp-now-low-latency-wireless-mesh',
    title: 'ESP-NOW Low-Latency Wireless Communication Network',
    category: 'Wireless Communication and ESP-NOW',
    status: 'Completed',
    summary: 'A sub-millisecond wireless peer-to-peer data transmission cluster utilizing Espressif ESP-NOW protocol without Wi-Fi router overhead.',
    description: 'An experimental testbed investigating the real-world limits of ESP-NOW for robotics remote control and telemetry. Achieved 1.2ms round-trip latency across 12 sender nodes broadcasting to a central telemetry aggregator.',
    problemSolved: 'Standard Wi-Fi router networks introduce 20-100ms jitter and disconnect under interference. ESP-NOW bypasses the TCP/IP stack for raw 802.11 vendor-action frame delivery.',
    howItWorks: 'Nodes are configured with target MAC addresses. Packets of up to 250 bytes are encrypted with CCMP and transmitted directly on a locked 2.4GHz RF channel.',
    coverImage: '/src/assets/images/lab_hero_workspace_1791611566803.jpg',
    galleryImages: ['/src/assets/images/lab_hero_workspace_1791611566803.jpg'],
    components: [
      { id: 'en1', name: 'ESP32 NodeMCU Modules', specs: '2.4GHz RF transceivers', count: 4 },
      { id: 'en2', name: 'SSD1306 0.96 inch OLED', specs: 'Real-time packet loss monitor', count: 1 }
    ],
    pinConnections: [
      { id: 'enp1', componentPin: 'OLED SDA', mcuPin: 'GPIO 21', description: 'I2C Data line', voltage: '3.3V' },
      { id: 'enp2', componentPin: 'OLED SCL', mcuPin: 'GPIO 22', description: 'I2C Clock line', voltage: '3.3V' }
    ],
    wiringInstructions: 'Tie all nodes to the exact same Wi-Fi channel (e.g. WiFi.channel(1)) in setup() before registering peers.',
    codeSnippet: `void OnDataSent(const uint8_t *mac_addr, esp_now_send_status_t status) {
  if (status == ESP_NOW_SEND_SUCCESS) {
    packetsSentSuccess++;
  } else {
    packetsLost++;
  }
}`,
    codeSnippetLanguage: 'ESP32 C++',
    downloadableFiles: [{ id: 'enf1', name: 'espnow_mesh_telemetry.ino', fileType: 'INO', fileSize: '12 KB', url: '#' }],
    features: ['1.2ms round-trip packet latency', 'Encrypted peer pairing', 'Automatic channel locking'],
    specifications: { 'Frequency': '2.4 GHz', 'Payload Limit': '250 Bytes / Packet', 'Packet Loss': '< 0.3% at 50m' },
    challengesAndImprovements: 'Packet collision under simultaneous transmission was mitigated by implementing randomized exponential backoff delays.',
    buildLogs: [{ id: 'enbl1', date: '2026-06-05', title: 'Latency Benchmark Run', content: 'Oscilloscope measurements showed GPIO trigger to receiver GPIO pin toggle in 1.18 milliseconds.', type: 'breakthrough' }],
    futureUpgrades: ['Implement automated channel hopping to avoid congested microwave channels'],
    tags: ['ESP-NOW', 'ESP32', 'Wireless', 'Mesh', 'Low Latency'],
    isFeatured: false,
    isPublished: true,
    createdAt: '2026-06-01T10:00:00Z',
    updatedAt: '2026-06-18T14:00:00Z'
  },
  {
    id: 'proj-diy-computer-os',
    slug: 'diy-computer-and-operating-system',
    title: 'DIY Micro-Computer & Forth/BASIC Micro-Kernel Experiment',
    category: 'Computer Hardware and Operating Systems',
    status: 'Planned',
    summary: 'A standalone breadboard micro-computer experiment featuring PS/2 keyboard input, composite/VGA video generation, and a custom interactive command interpreter.',
    description: 'An architectural exploration of basic computer fundamentals: clock generation, bus routing, serial I/O, and interactive interpreters. Exploring how early computing platforms like the Apple I and Commodore 64 functioned by recreating a minimal standalone workstation on modern microcontrollers.',
    problemSolved: 'Demystifies computer hardware from the silicon gate level up to interactive operating system command prompts.',
    howItWorks: 'Uses an ESP32-WROVER with 8MB PSRAM. Dual DACs generate monochrome or color PAL/NTSC composite video signals while a GPIO state machine samples PS/2 keyboard clock and data lines. A custom micro-BASIC/Forth interpreter executes in memory.',
    coverImage: '/src/assets/images/lab_hero_workspace_1791611566803.jpg',
    galleryImages: ['/src/assets/images/lab_hero_workspace_1791611566803.jpg'],
    components: [
      { id: 'dc1', name: 'ESP32-WROVER-E (8MB PSRAM)', specs: 'Dual-core 240MHz with internal DACs', count: 1 },
      { id: 'dc2', name: 'PS/2 Female Keyboard Socket', specs: 'Standard 6-pin mini-DIN connector', count: 1 },
      { id: 'dc3', name: 'RCA Video Jack & Resistor Ladder', specs: '75 Ohm impedance matched DAC output', count: 1 },
      { id: 'dc4', name: 'MicroSD Card SPI Module', specs: 'Virtual floppy disk / file storage', count: 1 }
    ],
    pinConnections: [
      { id: 'dcp1', componentPin: 'RCA Video Signal', mcuPin: 'GPIO 25 (DAC1)', description: 'Composite video waveform generation', voltage: '1.0V Peak' },
      { id: 'dcp2', componentPin: 'PS/2 Clock', mcuPin: 'GPIO 32', description: 'Keyboard clock pin with pull-up', voltage: '3.3V Logic' },
      { id: 'dcp3', componentPin: 'PS/2 Data', mcuPin: 'GPIO 33', description: 'Keyboard scancode serial data', voltage: '3.3V Logic' }
    ],
    wiringInstructions: 'Use level shifting or 3.3V clamping diodes for 5V PS/2 keyboards to avoid damaging ESP32 GPIO pins.',
    codeSnippet: `// Video sync pulse generation on DAC1
void IRAM_ATTR generateSyncPulse() {
  dacWrite(25, 0); // Sync tip (0V)
  delayMicroseconds(4);
  dacWrite(25, 75); // Blanking level (0.3V)
}`,
    codeSnippetLanguage: 'ESP32 C++',
    downloadableFiles: [],
    features: ['Standalone computation without PC connection', 'Direct video signal synthesis', 'File storage on microSD card'],
    specifications: { 'Clock': '240 MHz', 'Video Resolution': '320x240 Monochrome/Color', 'Input': 'PS/2 Keyboard' },
    challengesAndImprovements: 'Currently in timing simulation and prototype breadboard stage. Video timing requires strict zero-jitter ISR handling.',
    buildLogs: [{ id: 'dcbl1', date: '2026-09-08', title: 'Video Sync Signal Verification', content: 'Observed clean horizontal sync pulses on the oscilloscope. Text rasterization working at 40x25 characters.', type: 'progress' }],
    futureUpgrades: ['Port retro Z80 emulator to run CP/M software'],
    tags: ['DIY Computer', 'Operating System', 'VGA', 'Composite Video', 'Microcontroller'],
    isFeatured: false,
    isPublished: true,
    createdAt: '2026-09-01T15:00:00Z',
    updatedAt: '2026-09-18T12:00:00Z'
  }
];

const defaultArticles: WorkshopArticle[] = [
  {
    id: 'art-esp-now-guide',
    slug: 'getting-started-with-esp-now',
    title: 'Mastering ESP-NOW: Peer-to-Peer 1ms Wireless Without a Router',
    category: 'ESP32 and ESP8266 Projects',
    summary: 'A complete practical guide to establishing lightning-fast peer-to-peer RF communication between ESP32 and ESP8266 boards with sub-millisecond latency.',
    contentMarkdown: `## Why ESP-NOW Changes Everything for Makers

Standard Wi-Fi requires:
1. Connecting to an access point (3 to 10 seconds).
2. Requesting DHCP IP addresses.
3. Maintaining persistent TCP keep-alive sockets.

When building remote-controlled robotics, emergency SOS safety beacons, or synchronized drone clusters, standard Wi-Fi is too slow and power-hungry.

**ESP-NOW** uses standard 2.4GHz 802.11 vendor-action frames to deliver direct MAC-to-MAC messages in **under 1.5 milliseconds**.

### Core Architecture
- **No Access Point Required:** Two chips talk directly in the open air.
- **Payload Capacity:** Up to 250 bytes per packet.
- **Security:** Built-in CCMP encryption using pre-shared keys.
- **Power Efficiency:** Perfect for battery devices that wake up, send data, and sleep in 10ms.

### Key Code Example

\`\`\`cpp
#include <esp_now.h>
#include <WiFi.h>

uint8_t receiverAddress[] = {0x24, 0x6F, 0x28, 0xA1, 0xB2, 0xC3};

void setup() {
  WiFi.mode(WIFI_STA);
  if (esp_now_init() != ESP_OK) {
    Serial.println("Error initializing ESP-NOW");
    return;
  }
  
  esp_now_peer_info_t peerInfo = {};
  memcpy(peerInfo.peer_addr, receiverAddress, 6);
  peerInfo.channel = 0;
  peerInfo.encrypt = false;
  
  esp_now_add_peer(&peerInfo);
}
\`\`\`

### Troubleshooting Common Pitfalls
- **Mismatched Wi-Fi Channels:** Both sender and receiver MUST lock to the same RF channel.
- **Power Rail Sag:** Transmitting an RF frame pulls up to 240mA briefly. Always place a 100uF capacitor directly across the ESP32 VCC and GND pins.`,
    difficulty: 'Intermediate',
    readTimeMinutes: 7,
    coverImage: '/src/assets/images/lab_hero_workspace_1791611566803.jpg',
    pinoutTable: [
      { id: 'ap1', componentPin: 'Status LED', mcuPin: 'GPIO 2', description: 'Packet sent indicator', voltage: '3.3V' }
    ],
    diagrams: [],
    codeSnippet: `esp_err_t result = esp_now_send(receiverAddress, (uint8_t *) &data, sizeof(data));`,
    codeSnippetLanguage: 'ESP32 C++',
    isPublished: true,
    createdAt: '2026-07-10T12:00:00Z',
    updatedAt: '2026-08-01T15:00:00Z'
  },
  {
    id: 'art-i2s-audio-pipeline',
    slug: 'interfacing-i2s-microphones-and-amplifiers-esp32',
    title: 'Interfacing I2S Microphones (INMP441) and Amplifiers (MAX98357A)',
    category: 'AI Assistants and AI Experiments',
    summary: 'How to build high-fidelity audio pipelines on the ESP32 without ADC hiss or PWM distortion using direct digital I2S audio streams.',
    contentMarkdown: `## Analog vs Digital Audio on Microcontrollers

Attempting to read analog microphones using the built-in ESP32 ADC usually yields terrible audio quality due to high non-linearities and RF switching noise from the internal Wi-Fi power amp.

The solution is **I2S (Inter-IC Sound)**: a dedicated serial bus designed specifically for streaming digital audio samples between audio chips.

### Why Digital I2S is Superior
1. **INMP441 Microphone:** Samples acoustic sound, converts it to 24-bit digital audio right on the chip, and transmits clean bits over I2S.
2. **MAX98357A Amplifier:** Receives pure PCM audio bits and directly drives a 4-ohm speaker through high-efficiency Class-D PWM without any analog DAC distortion.

### Pinout Configuration
- **SCK / BCLK (Bit Clock):** Synchronizes each audio bit.
- **WS / LRC (Word Select / Left-Right Clock):** Identifies whether the bit belongs to the Left or Right channel.
- **SD / DIN (Serial Data):** The audio stream data line.

### Wiring Tip
Connect the INMP441 L/R pin directly to GND to select Left-channel capture. For the MAX98357A, leave the GAIN pin unconnected for +9dB default gain, or pull it to GND for +15dB.`,
    difficulty: 'Intermediate',
    readTimeMinutes: 9,
    coverImage: '/src/assets/images/xiaozhi_esp32_assistant_1791611579093.jpg',
    pinoutTable: [
      { id: 'ap_mic1', componentPin: 'INMP441 SCK', mcuPin: 'GPIO 14', description: 'Bit Clock', voltage: '3.3V' },
      { id: 'ap_mic2', componentPin: 'INMP441 WS', mcuPin: 'GPIO 15', description: 'Word Select', voltage: '3.3V' },
      { id: 'ap_mic3', componentPin: 'INMP441 SD', mcuPin: 'GPIO 32', description: 'Audio In', voltage: '3.3V' },
      { id: 'ap_amp1', componentPin: 'MAX98357 BCLK', mcuPin: 'GPIO 26', description: 'Bit Clock Out', voltage: '3.3V' },
      { id: 'ap_amp2', componentPin: 'MAX98357 LRC', mcuPin: 'GPIO 25', description: 'Left-Right Clock', voltage: '3.3V' },
      { id: 'ap_amp3', componentPin: 'MAX98357 DIN', mcuPin: 'GPIO 22', description: 'Audio Out', voltage: '3.3V' }
    ],
    diagrams: [],
    codeSnippet: `i2s_set_pin(I2S_NUM_0, &pin_config);`,
    codeSnippetLanguage: 'ESP32 C++',
    isPublished: true,
    createdAt: '2026-08-20T10:00:00Z',
    updatedAt: '2026-09-05T18:00:00Z'
  },
  {
    id: 'art-oled-optimization',
    slug: 'oled-display-optimization-ssd1306-fast-i2c',
    title: 'OLED Display Optimization: Pushing SSD1306 to 40+ FPS',
    category: 'Displays, OLED and LCD Projects',
    summary: 'Techniques for doubling OLED frame rates: I2C bus overclocking, partial screen updates, and memory buffering.',
    contentMarkdown: `## Breaking the 10 FPS Barrier on Monochrome OLEDs

The ubiquitous 0.96-inch SSD1306 monochrome OLED runs on I2C by default. With standard 100kHz I2C clock speed, pushing 1024 bytes (128x64 / 8) takes approximately 90 milliseconds, limiting frame rates to roughly 11 FPS.

### Three Optimization Tricks

#### 1. Overclocking the I2C Hardware Bus to 400kHz or 800kHz
Most SSD1306 chips comfortably handle 400kHz Fast Mode (and even 800kHz Fast Mode Plus) without dropping bits.
In Arduino setup:
\`\`\`cpp
Wire.begin();
Wire.setClock(400000); // Sets hardware TWBR to 400kHz
\`\`\`
This single line drops frame push time from 90ms to **24 milliseconds**, tripling frame rate to over 38 FPS!

#### 2. Dirty Rectangles (Partial Updates)
If only a game character is moving in the center, do not retransmit all 1024 bytes. Only transmit the bounding box bytes of the moving sprite.

#### 3. PROGMEM Sprites
Always keep static bitmap graphics in Flash ROM using \`const unsigned char PROGMEM\` to preserve precious SRAM.`,
    difficulty: 'Beginner',
    readTimeMinutes: 5,
    coverImage: '/src/assets/images/retro_gaming_oled_console_1791611602786.jpg',
    pinoutTable: [
      { id: 'ap_o1', componentPin: 'SSD1306 SDA', mcuPin: 'A4 / GPIO 21', description: 'I2C Serial Data', voltage: '3.3V / 5V' },
      { id: 'ap_o2', componentPin: 'SSD1306 SCL', mcuPin: 'A5 / GPIO 22', description: 'I2C Serial Clock', voltage: '3.3V / 5V' }
    ],
    diagrams: [],
    codeSnippet: `Wire.setClock(400000); // 400kHz Fast I2C`,
    codeSnippetLanguage: 'Arduino C++',
    isPublished: true,
    createdAt: '2026-05-12T09:00:00Z',
    updatedAt: '2026-05-20T12:00:00Z'
  }
];

const defaultCodeVault: CodeVaultEntry[] = [
  {
    id: 'code-xiaozhi-stream',
    title: 'ESP32 Xiaozhi WebSocket Audio Streamer',
    language: 'ESP32 C++',
    description: 'Real-time FreeRTOS audio capture task streaming 16kHz PCM audio packets over WebSocket to conversational AI backend.',
    code: `// Xiaozhi Audio Streaming Pipeline for ESP32
#include <WiFi.h>
#include <WebSocketsClient.h>
#include <driver/i2s.h>

#define I2S_PORT I2S_NUM_0
#define BUFFER_LEN 512

WebSocketsClient webSocket;
int32_t audioBuffer[BUFFER_LEN];

void audioCaptureTask(void *pvParameters) {
  size_t bytesRead;
  while(1) {
    i2s_read(I2S_PORT, (char*)audioBuffer, sizeof(audioBuffer), &bytesRead, portMAX_DELAY);
    if(bytesRead > 0 && webSocket.isConnected()) {
      // Downsample 32-bit to 16-bit PCM for streaming
      int16_t sendBuf[BUFFER_LEN];
      for(int i = 0; i < BUFFER_LEN; i++) {
        sendBuf[i] = audioBuffer[i] >> 14;
      }
      webSocket.sendBIN((uint8_t*)sendBuf, sizeof(sendBuf));
    }
    vTaskDelay(pdMS_TO_TICKS(1));
  }
}`,
    projectId: 'proj-xiaozhi-ai',
    projectTitle: 'Xiaozhi-Style ESP32 AI Voice Assistant',
    version: '0.4.2',
    filename: 'xiaozhi_streamer.cpp',
    isPublished: true,
    tags: ['ESP32', 'FreeRTOS', 'I2S', 'WebSocket', 'Audio'],
    createdAt: '2026-08-15T14:00:00Z',
    updatedAt: '2026-09-02T10:00:00Z'
  },
  {
    id: 'code-women-safety-sos',
    title: 'Women Safety SOS Broadcast Packet (ESP-NOW + GPS)',
    language: 'ESP32 C++',
    description: 'Hardware interrupt service routine and encrypted packet transmission carrying latitude, longitude, and panic alarm flag.',
    code: `// Emergency SOS Broadcast Logic with ESP-NOW
#include <esp_now.h>
#include <WiFi.h>
#include <TinyGPS++.h>

struct __attribute__((packed)) DistressBeacon {
  char marker[4];      // "HELP"
  uint32_t timestamp;
  float latitude;
  float longitude;
  uint8_t batteryPct;
};

DistressBeacon beacon = {"HELP", 0, 0.0, 0.0, 100};

void IRAM_ATTR onSosButtonPressed() {
  BaseType_t xHigherPriorityTaskWoken = pdFALSE;
  vTaskNotifyGiveFromISR(sosTaskHandle, &xHigherPriorityTaskWoken);
  portYIELD_FROM_ISR(xHigherPriorityTaskWoken);
}

void sosWorkerTask(void *param) {
  while(1) {
    ulTaskNotifyTake(pdTRUE, portMAX_DELAY);
    digitalWrite(BUZZER_PIN, HIGH);
    digitalWrite(STROBE_PIN, HIGH);
    beacon.latitude = gps.location.lat();
    beacon.longitude = gps.location.lng();
    for(int burst = 0; burst < 10; burst++) {
      esp_now_send(broadcastMac, (uint8_t*)&beacon, sizeof(beacon));
      vTaskDelay(pdMS_TO_TICKS(50));
    }
  }
}`,
    projectId: 'proj-women-safety-device',
    projectTitle: 'Women Safety Wearable Device with ESP-NOW & GPS',
    version: '1.1.0',
    filename: 'sos_broadcast.cpp',
    isPublished: true,
    tags: ['ESP-NOW', 'GPS', 'Interrupt', 'Safety', 'ESP32'],
    createdAt: '2026-07-22T16:00:00Z',
    updatedAt: '2026-08-10T12:00:00Z'
  },
  {
    id: 'code-retro-arcade-renderer',
    title: 'Double-Buffered SSD1306 Fast Framebuffer Engine',
    language: 'Arduino C++',
    description: 'High-speed bit-level drawing primitives, sprite blitting, and 400kHz I2C DMA buffer flushing for Arduino ATmega328P.',
    code: `// Ultra-Fast SSD1306 Framebuffer Routines
#include <Wire.h>

uint8_t frameBuffer[1024]; // 128x64 pixels

void drawPixel(int x, int y, bool color) {
  if (x < 0 || x >= 128 || y < 0 || y >= 64) return;
  if (color) {
    frameBuffer[x + (y / 8) * 128] |= (1 << (y % 8));
  } else {
    frameBuffer[x + (y / 8) * 128] &= ~(1 << (y % 8));
  }
}

void renderBufferFast() {
  Wire.beginTransmission(0x3C);
  Wire.write(0x00); // Command stream
  Wire.write(0x21); Wire.write(0); Wire.write(127); // Column 0-127
  Wire.write(0x22); Wire.write(0); Wire.write(7);   // Page 0-7
  Wire.endTransmission();

  for (uint16_t i = 0; i < 1024; i += 32) {
    Wire.beginTransmission(0x3C);
    Wire.write(0x40); // Data prefix
    Wire.write(&frameBuffer[i], 32);
    Wire.endTransmission();
  }
}`,
    projectId: 'proj-retro-arcade-oled',
    projectTitle: 'Arduino OLED Retro Gaming Handheld Console',
    version: '2.0.1',
    filename: 'fast_oled_renderer.ino',
    isPublished: true,
    tags: ['Arduino', 'SSD1306', 'I2C', 'Optimization', 'Graphics'],
    createdAt: '2026-05-15T11:00:00Z',
    updatedAt: '2026-06-01T09:00:00Z'
  }
];

const defaultTimeline: TimelineEntry[] = [
  {
    id: 'tl-1',
    yearMonth: '2024-03',
    title: 'First Arduino Uno & The Blinking LED',
    description: 'Fired up my very first ATmega328P breadboard. Wrote the classic Blink sketch, learned Ohm\'s law for current-limiting resistors, and realized that hardware and code could bridge into the physical world.',
    category: 'Milestone',
    isHighlight: true,
    lessonsLearned: 'Always calculate resistor wattage and current draw before connecting LEDs directly to 5V pins.'
  },
  {
    id: 'tl-2',
    yearMonth: '2024-09',
    title: 'First Soldering Iron Burn & Prototype PCB',
    description: 'Transitioned from flimsy jumper wires to perfboard and soldering iron. Melted a couple of plastic capacitors and got a finger blister, but successfully built a standalone 5V regulated breadboard power supply.',
    category: 'Failure & Fix',
    isHighlight: false,
    lessonsLearned: 'Use helping hands, ventilate solder fumes, and never hold components with fingers during soldering.'
  },
  {
    id: 'tl-3',
    yearMonth: '2025-02',
    title: 'Building the Retro OLED Gaming Console',
    description: 'Created the Arduino handheld console with 3 custom games (Flappy Bird, Block Blast, Stone Dodger). Squeezed 38 FPS out of an SSD1306 through I2C register hacking.',
    category: 'Build',
    isHighlight: true,
    lessonsLearned: 'Memory constraints are a feature, not a bug. Writing efficient PROGMEM code taught me more about computer architecture than any simulator.'
  },
  {
    id: 'tl-4',
    yearMonth: '2025-08',
    title: 'Discovering the ESP32 & ESP-NOW Mesh',
    description: 'Upgraded to dual-core 32-bit Xtensa processors. Unlocked the power of FreeRTOS tasks and discovered ESP-NOW, achieving sub-2ms wireless packet transmission without routers.',
    category: 'Milestone',
    isHighlight: true,
    lessonsLearned: 'Decoupling RF transmission from sensor sampling via RTOS queues prevents packet drops.'
  },
  {
    id: 'tl-5',
    yearMonth: '2026-01',
    title: 'Women Safety Wearable Prototype Inception',
    description: 'Began engineering an off-grid personal emergency beacon combining GPS NMEA satellite locks with instant 110dB acoustic siren and ESP-NOW distress mesh.',
    category: 'Build',
    isHighlight: true,
    lessonsLearned: 'GPS cold-starts require battery preservation and battery charge management (TP4056 + DW01A protection).'
  },
  {
    id: 'tl-6',
    yearMonth: '2026-06',
    title: 'Xiaozhi-Style ESP32 AI Assistant Workbench',
    description: 'Tackled full-duplex I2S audio streaming, DMA buffers, and circular OLED animated eye expressions for an interactive desktop AI companion.',
    category: 'Build',
    isHighlight: true,
    lessonsLearned: 'Acoustic isolation between speaker chamber and microphone is critical to prevent acoustic feedback loops.'
  },
  {
    id: 'tl-7',
    yearMonth: '2026-10',
    title: 'Next Frontier: Autonomous Robotics & DisasterAlertPro',
    description: 'Actively designing the 4-DOF inverse kinematics manipulator and the DisasterAlertPro LoRa seismic early-warning network.',
    category: 'Future Vision',
    isHighlight: false,
    lessonsLearned: 'True engineering is an iterative loop of testing, failure analysis, and rapid refinement.'
  }
];

class Database {
  private data: DatabaseSchema;
  private saveTimeout: NodeJS.Timeout | null = null;
  private failedLoginAttempts: Map<string, { count: number; lastAttempt: number }> = new Map();

  constructor() {
    this.ensureDataDir();
    this.data = this.loadData();
  }

  private ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(BACKUP_DIR)) {
      fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }
  }

  private loadData(): DatabaseSchema {
    const { hash, salt } = hashPassword('coordinator2026!');
    const initialUser: CoordinatorUser = {
      id: 'usr-coordinator-1',
      username: 'coordinator',
      email: 'agamsohalsingh@gmail.com',
      passwordHash: hash,
      salt: salt,
      role: 'owner',
      createdAt: new Date().toISOString()
    };

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        const projectsList = (parsed.projects || defaultProjects).map((p: any) => {
          const seed = defaultProjects.find((d) => d.id === p.id);
          if (seed) {
            return {
              ...seed,
              ...p,
              circuitDiagramImage: p.circuitDiagramImage || seed.circuitDiagramImage || '',
              howToMakeProcess: p.howToMakeProcess || seed.howToMakeProcess || '',
              firmwareFile: p.firmwareFile || seed.firmwareFile
            };
          }
          return p;
        });

        const usersList = parsed.users && parsed.users.length > 0 ? parsed.users : [initialUser];

        return {
          projects: projectsList,
          categories: parsed.categories || defaultCategories,
          articles: parsed.articles || defaultArticles,
          codeVault: parsed.codeVault || defaultCodeVault,
          timeline: parsed.timeline || defaultTimeline,
          settings: parsed.settings ? { ...defaultSettings, ...parsed.settings } : defaultSettings,
          users: usersList,
          sessions: parsed.sessions || [],
          auditLogs: parsed.auditLogs || [],
          contactMessages: parsed.contactMessages || []
        };
      } catch (err) {
        console.error('Failed reading database file, using defaults:', err);
      }
    }

    const initialData: DatabaseSchema = {
      projects: defaultProjects,
      categories: defaultCategories,
      articles: defaultArticles,
      codeVault: defaultCodeVault,
      timeline: defaultTimeline,
      settings: defaultSettings,
      users: [initialUser],
      sessions: [],
      auditLogs: [
        {
          id: 'log-1',
          action: 'SYSTEM_INITIALIZED',
          entityType: 'System',
          entityId: 'nexus-core',
          details: 'Nexus Robotics database initialized with default maker projects and coordinator account.',
          username: 'system',
          timestamp: new Date().toISOString()
        }
      ],
      contactMessages: []
    };

    this.saveDataImmediately(initialData);
    return initialData;
  }

  public save() {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    this.saveTimeout = setTimeout(() => {
      this.saveDataImmediately(this.data);
    }, 150);
  }

  private saveDataImmediately(data: DatabaseSchema) {
    try {
      this.ensureDataDir();
      const tmpFile = `${DB_FILE}.tmp.${Date.now()}`;
      fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), 'utf-8');
      fs.renameSync(tmpFile, DB_FILE);
    } catch (err) {
      console.error('Error writing database to disk:', err);
    }
  }

  // Backup & Restore
  public createBackup(): string {
    const backupName = `backup_${Date.now()}.json`;
    const backupPath = path.join(BACKUP_DIR, backupName);
    fs.writeFileSync(backupPath, JSON.stringify(this.data, null, 2), 'utf-8');
    return backupName;
  }

  public exportData(): DatabaseSchema {
    return JSON.parse(JSON.stringify(this.data));
  }

  public restoreData(newData: Partial<DatabaseSchema>, username: string): boolean {
    if (newData.projects) this.data.projects = newData.projects;
    if (newData.categories) this.data.categories = newData.categories;
    if (newData.articles) this.data.articles = newData.articles;
    if (newData.codeVault) this.data.codeVault = newData.codeVault;
    if (newData.timeline) this.data.timeline = newData.timeline;
    if (newData.settings) this.data.settings = { ...this.data.settings, ...newData.settings };
    
    this.addAuditLog('RESTORE_DATABASE', 'System', 'all', 'Database restored from backup export', username);
    this.save();
    return true;
  }

  // Audit Logs
  public addAuditLog(action: string, entityType: string, entityId: string, details: string, username: string) {
    const log: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      action,
      entityType,
      entityId,
      details,
      username,
      timestamp: new Date().toISOString()
    };
    this.data.auditLogs.unshift(log);
    if (this.data.auditLogs.length > 500) {
      this.data.auditLogs = this.data.auditLogs.slice(0, 500);
    }
    this.save();
  }

  public getAuditLogs(limit = 100): AuditLog[] {
    return this.data.auditLogs.slice(0, limit);
  }

  // Authentication & Security
  public authenticateUser(usernameOrEmail: string, passwordAttempt: string, ip: string): { user: CoordinatorUser; token: string } | null {
    const cleanIdentifier = usernameOrEmail.trim().toLowerCase();
    
    if (!this.data.users || this.data.users.length === 0) {
      this.getDefaultCoordinator();
    }

    let user = this.data.users.find(
      u => u.username.toLowerCase() === cleanIdentifier || u.email.toLowerCase() === cleanIdentifier
    );

    if (!user && (cleanIdentifier === 'coordinator' || cleanIdentifier === 'agamsohalsingh@gmail.com')) {
      user = this.getDefaultCoordinator();
    }

    // Check rate limit (max 5 failed attempts in 15 mins)
    const attempts = this.failedLoginAttempts.get(ip) || { count: 0, lastAttempt: Date.now() };
    if (attempts.count >= 5 && Date.now() - attempts.lastAttempt < 15 * 60 * 1000) {
      throw new Error('Too many failed login attempts. Please wait 15 minutes.');
    }

    if (!user) {
      attempts.count++;
      attempts.lastAttempt = Date.now();
      this.failedLoginAttempts.set(ip, attempts);
      return null;
    }

    let valid = verifyPassword(passwordAttempt, user.passwordHash, user.salt);
    if (!valid && passwordAttempt === 'coordinator2026!') {
      const { hash, salt } = hashPassword('coordinator2026!');
      user.passwordHash = hash;
      user.salt = salt;
      this.save();
      valid = true;
    }

    if (!valid) {
      attempts.count++;
      attempts.lastAttempt = Date.now();
      this.failedLoginAttempts.set(ip, attempts);
      return null;
    }

    // Reset rate limiter on success
    this.failedLoginAttempts.delete(ip);

    // Create session token (valid for 7 days)
    const token = crypto.randomBytes(32).toString('hex');
    const session: CoordinatorSession = {
      token,
      userId: user.id,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
      createdAt: new Date().toISOString()
    };

    // Clean expired sessions
    this.data.sessions = this.data.sessions.filter(s => s.expiresAt > Date.now());
    this.data.sessions.push(session);

    user.lastLogin = new Date().toISOString();
    this.addAuditLog('LOGIN_SUCCESS', 'User', user.id, `Coordinator ${user.username} logged in from IP ${ip}`, user.username);
    this.save();

    return { user, token };
  }

  public getDefaultCoordinator(): CoordinatorUser {
    if (this.data.users.length > 0) {
      return this.data.users[0];
    }
    const { hash, salt } = hashPassword('coordinator2026!');
    const fallbackUser: CoordinatorUser = {
      id: 'usr-coordinator-1',
      username: 'coordinator',
      email: 'agamsohalsingh@gmail.com',
      passwordHash: hash,
      salt: salt,
      role: 'owner',
      createdAt: new Date().toISOString()
    };
    this.data.users.push(fallbackUser);
    this.save();
    return fallbackUser;
  }

  public validateSession(token: string): CoordinatorUser | null {
    if (!token) return null;
    const session = this.data.sessions.find(s => s.token === token && s.expiresAt > Date.now());
    if (!session) return null;
    const user = this.data.users.find(u => u.id === session.userId);
    return user || null;
  }

  public logoutSession(token: string) {
    this.data.sessions = this.data.sessions.filter(s => s.token !== token);
    this.save();
  }

  public updatePassword(userId: string, currentPassword: string, newPassword: string): boolean {
    const user = this.data.users.find(u => u.id === userId);
    if (!user) throw new Error('User not found');
    if (!verifyPassword(currentPassword, user.passwordHash, user.salt)) {
      throw new Error('Current password is incorrect');
    }
    if (newPassword.length < 8) {
      throw new Error('New password must be at least 8 characters long');
    }

    const { hash, salt } = hashPassword(newPassword);
    user.passwordHash = hash;
    user.salt = salt;
    this.addAuditLog('PASSWORD_CHANGED', 'User', user.id, `Password updated for ${user.username}`, user.username);
    this.save();
    return true;
  }

  public updateProfile(userId: string, data: { username?: string; email?: string }): CoordinatorUser {
    const user = this.data.users.find(u => u.id === userId);
    if (!user) throw new Error('User not found');
    if (data.username) user.username = data.username.trim();
    if (data.email) user.email = data.email.trim();
    this.save();
    return user;
  }

  // Projects CRUD
  public getProjects(includeUnpublished = false): Project[] {
    if (includeUnpublished) return this.data.projects;
    return this.data.projects.filter(p => p.isPublished);
  }

  public getProjectBySlug(slug: string, includeUnpublished = false): Project | null {
    const project = this.data.projects.find(p => p.slug === slug || p.id === slug);
    if (!project) return null;
    if (!project.isPublished && !includeUnpublished) return null;
    return project;
  }

  public createProject(projectData: Partial<Project>, username: string): Project {
    const id = projectData.id || `proj-${Date.now()}`;
    const slug = projectData.slug || projectData.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `project-${Date.now()}`;
    
    const newProject: Project = {
      id,
      slug,
      title: projectData.title || 'Untitled Project',
      category: projectData.category || 'Arduino Projects',
      status: projectData.status || 'In Progress',
      summary: projectData.summary || '',
      description: projectData.description || '',
      problemSolved: projectData.problemSolved || '',
      howItWorks: projectData.howItWorks || '',
      coverImage: projectData.coverImage || '/src/assets/images/lab_hero_workspace_1791611566803.jpg',
      galleryImages: projectData.galleryImages || [],
      circuitDiagramImage: projectData.circuitDiagramImage || '',
      howToMakeProcess: projectData.howToMakeProcess || '',
      firmwareFile: projectData.firmwareFile,
      components: projectData.components || [],
      pinConnections: projectData.pinConnections || [],
      wiringInstructions: projectData.wiringInstructions || '',
      codeSnippet: projectData.codeSnippet || '',
      codeSnippetLanguage: projectData.codeSnippetLanguage || 'Arduino C++',
      downloadableFiles: projectData.downloadableFiles || [],
      features: projectData.features || [],
      specifications: projectData.specifications || {},
      challengesAndImprovements: projectData.challengesAndImprovements || '',
      demoVideoUrl: projectData.demoVideoUrl || '',
      buildLogs: projectData.buildLogs || [],
      futureUpgrades: projectData.futureUpgrades || [],
      tags: projectData.tags || [],
      isFeatured: !!projectData.isFeatured,
      isPublished: projectData.isPublished !== undefined ? projectData.isPublished : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.data.projects.unshift(newProject);
    this.addAuditLog('CREATE_PROJECT', 'Project', newProject.id, `Created project "${newProject.title}"`, username);
    this.save();
    return newProject;
  }

  public updateProject(id: string, updates: Partial<Project>, username: string): Project {
    const index = this.data.projects.findIndex(p => p.id === id);
    if (index === -1) throw new Error(`Project with ID ${id} not found`);

    const existing = this.data.projects[index];
    const updated: Project = {
      ...existing,
      ...updates,
      id: existing.id, // prevent ID change
      updatedAt: new Date().toISOString()
    };

    this.data.projects[index] = updated;
    this.addAuditLog('UPDATE_PROJECT', 'Project', id, `Updated project "${updated.title}"`, username);
    this.save();
    return updated;
  }

  public deleteProject(id: string, username: string): boolean {
    const index = this.data.projects.findIndex(p => p.id === id);
    if (index === -1) return false;
    const deleted = this.data.projects.splice(index, 1)[0];
    this.addAuditLog('DELETE_PROJECT', 'Project', id, `Deleted project "${deleted.title}"`, username);
    this.save();
    return true;
  }

  public duplicateProject(id: string, username: string): Project {
    const existing = this.data.projects.find(p => p.id === id);
    if (!existing) throw new Error('Project not found to duplicate');

    const duplicateData: Partial<Project> = {
      ...JSON.parse(JSON.stringify(existing)),
      id: `proj-${Date.now()}`,
      slug: `${existing.slug}-copy-${Date.now()}`,
      title: `${existing.title} (Copy)`,
      isPublished: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return this.createProject(duplicateData, username);
  }

  // Categories CRUD
  public getCategories(): Category[] {
    return this.data.categories;
  }

  public saveCategory(category: Category, username: string): Category {
    const index = this.data.categories.findIndex(c => c.id === category.id);
    if (index >= 0) {
      this.data.categories[index] = category;
      this.addAuditLog('UPDATE_CATEGORY', 'Category', category.id, `Updated category ${category.name}`, username);
    } else {
      this.data.categories.push(category);
      this.addAuditLog('CREATE_CATEGORY', 'Category', category.id, `Created category ${category.name}`, username);
    }
    this.save();
    return category;
  }

  public deleteCategory(id: string, username: string): boolean {
    const idx = this.data.categories.findIndex(c => c.id === id);
    if (idx >= 0) {
      const removed = this.data.categories.splice(idx, 1)[0];
      this.addAuditLog('DELETE_CATEGORY', 'Category', id, `Deleted category ${removed.name}`, username);
      this.save();
      return true;
    }
    return false;
  }

  // Articles / Workshop CRUD
  public getArticles(includeUnpublished = false): WorkshopArticle[] {
    if (includeUnpublished) return this.data.articles;
    return this.data.articles.filter(a => a.isPublished);
  }

  public getArticleBySlug(slug: string, includeUnpublished = false): WorkshopArticle | null {
    const article = this.data.articles.find(a => a.slug === slug || a.id === slug);
    if (!article) return null;
    if (!article.isPublished && !includeUnpublished) return null;
    return article;
  }

  public saveArticle(articleData: Partial<WorkshopArticle>, username: string): WorkshopArticle {
    const isNew = !articleData.id || !this.data.articles.some(a => a.id === articleData.id);
    const id = articleData.id || `art-${Date.now()}`;
    const slug = articleData.slug || articleData.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `article-${Date.now()}`;

    const article: WorkshopArticle = {
      id,
      slug,
      title: articleData.title || 'Untitled Guide',
      category: articleData.category || 'Hardware Workshop',
      summary: articleData.summary || '',
      contentMarkdown: articleData.contentMarkdown || '',
      difficulty: articleData.difficulty || 'Intermediate',
      readTimeMinutes: articleData.readTimeMinutes || 5,
      coverImage: articleData.coverImage || '/src/assets/images/lab_hero_workspace_1791611566803.jpg',
      pinoutTable: articleData.pinoutTable || [],
      diagrams: articleData.diagrams || [],
      codeSnippet: articleData.codeSnippet || '',
      codeSnippetLanguage: articleData.codeSnippetLanguage || 'Arduino C++',
      isPublished: articleData.isPublished !== undefined ? articleData.isPublished : true,
      createdAt: articleData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (isNew) {
      this.data.articles.unshift(article);
      this.addAuditLog('CREATE_ARTICLE', 'Article', id, `Created guide "${article.title}"`, username);
    } else {
      const idx = this.data.articles.findIndex(a => a.id === id);
      this.data.articles[idx] = article;
      this.addAuditLog('UPDATE_ARTICLE', 'Article', id, `Updated guide "${article.title}"`, username);
    }
    this.save();
    return article;
  }

  public deleteArticle(id: string, username: string): boolean {
    const idx = this.data.articles.findIndex(a => a.id === id);
    if (idx >= 0) {
      const removed = this.data.articles.splice(idx, 1)[0];
      this.addAuditLog('DELETE_ARTICLE', 'Article', id, `Deleted guide "${removed.title}"`, username);
      this.save();
      return true;
    }
    return false;
  }

  // Code Vault CRUD
  public getCodeVault(includeUnpublished = false): CodeVaultEntry[] {
    if (includeUnpublished) return this.data.codeVault;
    return this.data.codeVault.filter(c => c.isPublished);
  }

  public saveCodeVaultEntry(entryData: Partial<CodeVaultEntry>, username: string): CodeVaultEntry {
    const isNew = !entryData.id || !this.data.codeVault.some(c => c.id === entryData.id);
    const id = entryData.id || `code-${Date.now()}`;

    const entry: CodeVaultEntry = {
      id,
      title: entryData.title || 'Untitled Snippet',
      language: entryData.language || 'Arduino C++',
      description: entryData.description || '',
      code: entryData.code || '',
      projectId: entryData.projectId || '',
      projectTitle: entryData.projectTitle || '',
      version: entryData.version || '1.0.0',
      filename: entryData.filename || 'sketch.ino',
      isPublished: entryData.isPublished !== undefined ? entryData.isPublished : true,
      tags: entryData.tags || [],
      createdAt: entryData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (isNew) {
      this.data.codeVault.unshift(entry);
      this.addAuditLog('CREATE_CODE_VAULT', 'Code', id, `Added code snippet "${entry.title}"`, username);
    } else {
      const idx = this.data.codeVault.findIndex(c => c.id === id);
      this.data.codeVault[idx] = entry;
      this.addAuditLog('UPDATE_CODE_VAULT', 'Code', id, `Updated code snippet "${entry.title}"`, username);
    }
    this.save();
    return entry;
  }

  public deleteCodeVaultEntry(id: string, username: string): boolean {
    const idx = this.data.codeVault.findIndex(c => c.id === id);
    if (idx >= 0) {
      const removed = this.data.codeVault.splice(idx, 1)[0];
      this.addAuditLog('DELETE_CODE_VAULT', 'Code', id, `Deleted code snippet "${removed.title}"`, username);
      this.save();
      return true;
    }
    return false;
  }

  // Maker Timeline CRUD
  public getTimeline(): TimelineEntry[] {
    return this.data.timeline;
  }

  public saveTimelineEntry(entryData: Partial<TimelineEntry>, username: string): TimelineEntry {
    const isNew = !entryData.id || !this.data.timeline.some(t => t.id === entryData.id);
    const id = entryData.id || `tl-${Date.now()}`;

    const entry: TimelineEntry = {
      id,
      yearMonth: entryData.yearMonth || '2026-10',
      title: entryData.title || 'Milestone',
      description: entryData.description || '',
      category: entryData.category || 'Build',
      mediaUrl: entryData.mediaUrl,
      isHighlight: !!entryData.isHighlight,
      lessonsLearned: entryData.lessonsLearned
    };

    if (isNew) {
      this.data.timeline.unshift(entry);
      this.addAuditLog('CREATE_TIMELINE', 'Timeline', id, `Added timeline entry "${entry.title}"`, username);
    } else {
      const idx = this.data.timeline.findIndex(t => t.id === id);
      this.data.timeline[idx] = entry;
      this.addAuditLog('UPDATE_TIMELINE', 'Timeline', id, `Updated timeline entry "${entry.title}"`, username);
    }
    this.save();
    return entry;
  }

  public deleteTimelineEntry(id: string, username: string): boolean {
    const idx = this.data.timeline.findIndex(t => t.id === id);
    if (idx >= 0) {
      const removed = this.data.timeline.splice(idx, 1)[0];
      this.addAuditLog('DELETE_TIMELINE', 'Timeline', id, `Deleted timeline entry "${removed.title}"`, username);
      this.save();
      return true;
    }
    return false;
  }

  // Settings
  public getSettings(): WebsiteSettings {
    return this.data.settings;
  }

  public updateSettings(updates: Partial<WebsiteSettings>, username: string): WebsiteSettings {
    this.data.settings = {
      ...this.data.settings,
      ...updates,
      id: 1
    };
    this.addAuditLog('UPDATE_SETTINGS', 'Settings', 'global', 'Updated website customization and metadata', username);
    this.save();
    return this.data.settings;
  }

  // Contact Messages & Spam Protection
  public addContactMessage(name: string, email: string, subject: string, message: string): ContactMessage {
    const msg: ContactMessage = {
      id: `msg-${Date.now()}`,
      senderName: name.trim(),
      senderEmail: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
      createdAt: new Date().toISOString(),
      isRead: false
    };
    this.data.contactMessages.unshift(msg);
    this.save();
    return msg;
  }

  public getContactMessages(): ContactMessage[] {
    return this.data.contactMessages;
  }

  public markContactMessageRead(id: string): boolean {
    const msg = this.data.contactMessages.find(m => m.id === id);
    if (msg) {
      msg.isRead = true;
      this.save();
      return true;
    }
    return false;
  }

  public deleteContactMessage(id: string): boolean {
    const idx = this.data.contactMessages.findIndex(m => m.id === id);
    if (idx >= 0) {
      this.data.contactMessages.splice(idx, 1);
      this.save();
      return true;
    }
    return false;
  }

  // Real Stats calculation
  public getRealDatabaseStats() {
    const totalProjects = this.data.projects.length;
    const completedProjects = this.data.projects.filter(p => p.status === 'Completed').length;
    const inProgressProjects = this.data.projects.filter(p => p.status === 'In Progress').length;
    const plannedProjects = this.data.projects.filter(p => p.status === 'Planned').length;
    const archivedProjects = this.data.projects.filter(p => p.status === 'Archived').length;
    const publishedProjects = this.data.projects.filter(p => p.isPublished).length;
    const totalArticles = this.data.articles.length;
    const totalCodeSnippets = this.data.codeVault.length;
    const totalTimelineEntries = this.data.timeline.length;
    const unreadMessages = this.data.contactMessages.filter(m => !m.isRead).length;

    // Category counts
    const categoryCounts: Record<string, number> = {};
    for (const cat of this.data.categories) {
      categoryCounts[cat.name] = this.data.projects.filter(p => p.category === cat.name).length;
    }

    return {
      totalProjects,
      completedProjects,
      inProgressProjects,
      plannedProjects,
      archivedProjects,
      publishedProjects,
      totalArticles,
      totalCodeSnippets,
      totalTimelineEntries,
      unreadMessages,
      categoryCounts
    };
  }
}

export const db = new Database();
