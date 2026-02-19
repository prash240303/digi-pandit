
      {/* AlertDialog */}
      {/* <AlertDialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <View>
              <Text className="text-xl font-bold text-amber-900">
                {selectedDay &&
                  `${WEEKDAY_NAMES[selectedDay.date.getMonth()]} `}
                {selectedDay &&
                  `${MONTH_NAMES[selectedDay.date.getMonth()]} ${selectedDay.date.getDate()}, ${selectedDay.date.getFullYear()}`}
              </Text>
            </View>
            <AlertDialogCloseButton onPress={() => setIsOpen(false)}>
              <HugeiconsIcon icon={Cancel01FreeIcons} />
            </AlertDialogCloseButton>
          </AlertDialogHeader>

          <AlertDialogBody>
            {selectedDay && (
              <ScrollView className="max-h-96">
                <View className="w-full p-4 mb-6 bg-neutral-200 rounded-3xl shadow-md">
                  <View className="bg-white shadow-sm rounded-2xl p-5 flex-row flex-wrap">
                    <View className="w-1/2 mb-6">
                      <Text className="text-gray-400 text-lg font-medium">
                        Tithi
                      </Text>
                      <Text className="text-sky-500 text-2xl font-bold mt-1">
                        {getCurrentTithi(selectedDay.panchangam).tithi}
                      </Text>
                    </View>

                    <View className="w-1/2 mb-6">
                      <Text className="text-gray-400 text-lg font-medium">
                        Nakshatra
                      </Text>
                      <Text className="text-blue-600 text-2xl font-bold mt-1">
                        {getCurrentNakshatra(selectedDay.panchangam)}
                      </Text>
                    </View>

                    <View className="w-1/2">
                      <Text className="text-gray-400 text-lg font-medium">
                        Karana
                      </Text>
                      <Text className="text-amber-500 text-2xl font-bold mt-1">
                        {getCurrentKarana(selectedDay.panchangam)}
                      </Text>
                    </View>

                    <View className="w-1/2">
                      <Text className="text-gray-400 text-lg font-medium">
                        Yoga
                      </Text>
                      <Text className="text-rose-500 text-2xl font-bold mt-1">
                        {getCurrentYoga(selectedDay.panchangam)}
                      </Text>
                    </View>
                  </View>
                </View>

                <View className="mb-3  p-4 rounded-lg">
                  {(() => {
                    const sunriseStr = formatTime(
                      selectedDay.panchangam.sunrise,
                    );
                    const sunsetStr = formatTime(selectedDay.panchangam.sunset);

                    const sunrise = parseTime12h(sunriseStr);
                    const sunset = parseTime12h(sunsetStr);

                    return (
                      <SunriseSunset
                        sunriseHour={sunrise.hour}
                        sunriseMinute={sunrise.minute}
                        sunsetHour={sunset.hour}
                        sunsetMinute={sunset.minute}
                      />
                    );
                  })()}
                </View>
                <View className="bg-blue-100 flex flex-col gap-2 items-center justify-center mb-3 p-4 rounded-lg">
                  <Text className="text-blue-700 text-4xl">
                    {getChandrabalam(selectedDay)}
                  </Text>
                  <Text className="text-blacl">
                    {selectedDay.panchangam.chandrabalam} % illuminated
                  </Text>
                </View>

                <PeriodCard
                  title="Brahma Muhurta"
                  start={brahma?.start}
                  end={brahma?.end}
                  status="AUSPICIOUS"
                  icon="🌅"
                />

                <PeriodCard
                  title="Rahu Kalam"
                  start={rahu?.start}
                  end={rahu?.end}
                  status="AVOID"
                  icon="🚫"
                />

                <PeriodCard
                  title="Yamaganda"
                  start={yamaganda?.start}
                  end={yamaganda?.end}
                  status="AVOID"
                  icon="⚠️"
                />

                <PlanetaryPositions data={planetaryData(selectedDay)} />
                {selectedDay.panchangam.festivals?.length > 0 && (
                  <>
                    <View className="bg-pink-100 p-4 rounded-lg">
                      <Text className="font-semibold text-pink-900 mb-2">
                        🎉 Festivals
                      </Text>
                      {selectedDay.panchangam.festivals.map(
                        (festival: string, idx: number) => (
                          <View key={idx} className="ml-2">
                            <Text className="text-pink-700">• {festival}</Text>
                          </View>
                        ),
                      )}
                    </View>
                  </>
                )}
              </ScrollView>
            )}
          </AlertDialogBody>
        </AlertDialogContent>
      </AlertDialog> */}