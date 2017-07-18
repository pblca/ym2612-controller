(import [CHIP_IO.GPIO :as io])
(import time)
(.setup io "U14_15" io.OUT)

(defn blink [t] 
  (
    (.output io "U14_15" io.HIGH)
    (.sleep time t)
    (.output io "U14_15" io.LOW)
    (.sleep time t)
    (blink t) 
  )
)

(blink 1)
