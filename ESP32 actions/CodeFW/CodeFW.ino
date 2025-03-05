#include <WiFi.h>
#include <ESP32Servo.h>
#include <WebServer.h>

// WiFi Credentials (Change these!)
const char* ssid = "TP-LINK_DC0F08";  
const char* password = "19021970";    

// Servo Settings
Servo myServo;  
const int servoPin = 13;  // Connect Servo Signal pin to GPIO 13

// Web Server
WebServer server(80);  

void setup() {
    Serial.begin(115200);  
    delay(1000);  
    Serial.println("\nESP32 Booting...");

    // Start WiFi Connection
    WiFi.mode(WIFI_STA);
    WiFi.begin(ssid, password);
    
    Serial.println("Connecting to WiFi...");
    int attempt = 0;
    while (WiFi.status() != WL_CONNECTED) {
        delay(1000);
        Serial.print(".");
        attempt++;
        if (attempt > 15) {
            Serial.println("\nFailed to connect! Restarting...");
            ESP.restart();  
        }
    }
    
    Serial.println("\nWiFi Connected!");
    Serial.print("ESP32 IP Address: ");
    Serial.println(WiFi.localIP());

    // Attach Servo
    myServo.attach(servoPin);
    myServo.write(0);  // Ensure servo starts at closed position
    Serial.println("Servo Initialized");

    // Define API Endpoint
    server.on("/open_gate", []() {
        Serial.println("Opening Gate...");
        myServo.write(90);  // Move Servo to 90° (Open)
        delay(2000);  
        myServo.write(0);  // Return to 0° (Close)
        Serial.println("Gate Closed");
        server.send(200, "text/plain", "Gate Opened and Closed!");
    });

    // Start Web Server
    server.begin();
    Serial.println("Web Server Started");
}

void loop() {
    server.handleClient();  // Handle web requests
}
