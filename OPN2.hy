(import [CHIP_IO.GPIO :as io])
(import [CHIP_IO.SOFTPWM :as pwm])
(import [time.sleep as sleep])

(defn 8->d [8bit]
  "Converts 8bit value to decimal"
  (-> (/ 100 255) (* 8bit)))

(defn write [pin value]
  "Writes PWN value to selected pin"
  ((.start pwn pin value 2000)))

(defn 8->l [8bit]
  "Takes Decimal and converts to array of binary values for writing to databus"
  (setv bitVals (-> (bin 8bit) (list) (cut 2)))
  (while (< (len bitVals) 8) (.insert bitVals 0 "0"))
  (eval bitVals))
  ;; (while (< (len bitVals) 8) (.insert bitVals 0 0))

; Pin definition (:d0-7 :a0 :a1 :cs :wr :ic)
(def pins {
    :d0 "U14_13" ; XIO-P0
    :d1 "U14_14" ; XIO-P1
    :d2 "U14_15" ; GPIO1
    :d3 "U14_16" ; GPIO2
    :d4 "U14_17" ; GPIO3
    :d5 "U14_18" ; GPIO4
    :d6 "U14_19" ; GPIO5
    :d7 "U14_20" ; GPIO6
    :a0 "U14_31" ; D0     Read/Write Enable, Active High
    :a1 "U14_32" ; D1     Part 1 / Part 2 ( low=1, high=2 )
    :cs "U14_33" ; D2     Chip Select
    :wr "U14_34" ; D3     Write mode on data bus, Active Low
    :ic "U14_35" ; D4     System Reset, Initialize Registers, Active Low
  })

; Initial Pin Setup
(do
  (.cleanup io)
  (map (fn [p]
      ((.setup p io.OUT )))
      [(:a1 pins) (:cs pins) (:wr pins) (:ic pins)])

  (.output io (:ic pins) 0)
  (sleep .1)
  (.output io (:cs pins) 1)
  (sleep .1)

  (.cleanup pwn))
