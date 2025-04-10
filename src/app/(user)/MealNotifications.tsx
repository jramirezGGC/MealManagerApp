import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform, ScrollView, Switch } from "react-native"
import { StatusBar } from "expo-status-bar"
import { router } from "expo-router"
import Colors from "@/src/constants/Colors"
import { Feather, MaterialIcons, Ionicons } from "@expo/vector-icons"

export default function MealNotificationsScreen() {
  // State for notification toggles
  const [allNotifications, setAllNotifications] = useState(true)
  const [expirationAlerts, setExpirationAlerts] = useState(true)
  const [lowInventoryAlerts, setLowInventoryAlerts] = useState(true)
  const [soundAlerts, setSoundAlerts] = useState(true)
  const [badgeAlerts, setBadgeAlerts] = useState(true)
  const [weeklyReports, setWeeklyReports] = useState(false)

  // Handle toggling all notifications
  const handleToggleAll = (value: boolean) => {
    setAllNotifications(value);
    if (!value) {
      // If turning off all, turn off all individual settings
      setExpirationAlerts(false)
      setLowInventoryAlerts(false)
      setSoundAlerts(false)
      setBadgeAlerts(false)
      setWeeklyReports(false)
    } else {
      // If turning on all, turn on default settings
      setExpirationAlerts(true)
      setLowInventoryAlerts(true)
      setSoundAlerts(true)
      setBadgeAlerts(true)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header Section */}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Meal Notifications</Text>
            <Text style={styles.headerSubtitle}>Manage your notification preferences</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          {/* Main Toggle Section */}
          <View style={styles.mainToggleSection}>
            <View style={styles.toggleContainer}>
              <View style={styles.toggleInfo}>
                <View style={styles.iconContainer}>
                  <Ionicons name="notifications" size={24} color={Colors.white} />
                </View>
                <View style={styles.toggleTextContainer}>
                  <Text style={styles.toggleTitle}>All Notifications</Text>
                  <Text style={styles.toggleDescription}>
                    {allNotifications ? "Notifications are enabled" : "Notifications are disabled"}
                  </Text>
                </View>
              </View>
              <Switch
                value={allNotifications}
                onValueChange={handleToggleAll}
                trackColor={{ false: "#E2E2E2", true: Colors.primary }}
                thumbColor={Colors.white}
                ios_backgroundColor="#E2E2E2"
              />
            </View>
          </View>

          {/* Notification Types Section */}
          {allNotifications && (
            <>
              <Text style={styles.sectionTitle}>Notification Types</Text>
              <View style={styles.notificationSection}>
                <View style={styles.toggleContainer}>
                  <View style={styles.toggleInfo}>
                    <View style={[styles.iconContainer, { backgroundColor: "#FF9800" }]}>
                      <MaterialIcons name="access-time" size={20} color={Colors.white} />
                    </View>
                    <View style={styles.toggleTextContainer}>
                      <Text style={styles.toggleTitle}>Expiration Alerts</Text>
                      <Text style={styles.toggleDescription}>Get notified when meals are about to expire</Text>
                    </View>
                  </View>
                  <Switch
                    value={expirationAlerts}
                    onValueChange={setExpirationAlerts}
                    trackColor={{ false: "#E2E2E2", true: Colors.primary }}
                    thumbColor={Colors.white}
                    ios_backgroundColor="#E2E2E2"
                    disabled={!allNotifications}
                  />
                </View>

                <View style={styles.divider} />

                <View style={styles.toggleContainer}>
                  <View style={styles.toggleInfo}>
                    <View style={[styles.iconContainer, { backgroundColor: "#4CAF50" }]}>
                      <Feather name="package" size={20} color={Colors.white} />
                    </View>
                    <View style={styles.toggleTextContainer}>
                      <Text style={styles.toggleTitle}>Low Inventory Alerts</Text>
                      <Text style={styles.toggleDescription}>Get notified when meal inventory is running low</Text>
                    </View>
                  </View>
                  <Switch
                    value={lowInventoryAlerts}
                    onValueChange={setLowInventoryAlerts}
                    trackColor={{ false: "#E2E2E2", true: Colors.primary }}
                    thumbColor={Colors.white}
                    ios_backgroundColor="#E2E2E2"
                    disabled={!allNotifications}
                  />
                </View>

                <View style={styles.divider} />

                {/* <View style={styles.toggleContainer}>
                  <View style={styles.toggleInfo}>
                    <View style={[styles.iconContainer, { backgroundColor: "#9C27B0" }]}>
                      <MaterialIcons name="insert-chart" size={20} color={Colors.white} />
                    </View>
                    <View style={styles.toggleTextContainer}>
                      <Text style={styles.toggleTitle}>Weekly Reports</Text>
                      <Text style={styles.toggleDescription}>Receive weekly summaries of your meal inventory</Text>
                    </View>
                  </View>
                  <Switch
                    value={weeklyReports}
                    onValueChange={setWeeklyReports}
                    trackColor={{ false: "#E2E2E2", true: Colors.primary }}
                    thumbColor={Colors.white}
                    ios_backgroundColor="#E2E2E2"
                    disabled={!allNotifications}
                  />
                </View> */}
              </View>

              {/* Alert Preferences Section */}
              <Text style={styles.sectionTitle}>Alert Preferences</Text>
              <View style={styles.notificationSection}>
                <View style={styles.toggleContainer}>
                  <View style={styles.toggleInfo}>
                    <View style={[styles.iconContainer, { backgroundColor: "#2196F3" }]}>
                      <Ionicons name="volume-high" size={20} color={Colors.white} />
                    </View>
                    <View style={styles.toggleTextContainer}>
                      <Text style={styles.toggleTitle}>Sound Alerts</Text>
                      <Text style={styles.toggleDescription}>Play sound when notifications arrive</Text>
                    </View>
                  </View>
                  <Switch
                    value={soundAlerts}
                    onValueChange={setSoundAlerts}
                    trackColor={{ false: "#E2E2E2", true: Colors.primary }}
                    thumbColor={Colors.white}
                    ios_backgroundColor="#E2E2E2"
                    disabled={!allNotifications}
                  />
                </View>

                <View style={styles.divider} />

                <View style={styles.toggleContainer}>
                  <View style={styles.toggleInfo}>
                    <View style={[styles.iconContainer, { backgroundColor: "#F44336" }]}>
                      <MaterialIcons name="notifications-active" size={20} color={Colors.white} />
                    </View>
                    <View style={styles.toggleTextContainer}>
                      <Text style={styles.toggleTitle}>Badge Alerts</Text>
                      <Text style={styles.toggleDescription}>Show badge count on app icon</Text>
                    </View>
                  </View>
                  <Switch
                    value={badgeAlerts}
                    onValueChange={setBadgeAlerts}
                    trackColor={{ false: "#E2E2E2", true: Colors.primary }}
                    thumbColor={Colors.white}
                    ios_backgroundColor="#E2E2E2"
                    disabled={!allNotifications}
                  />
                </View>
              </View>
            </>
          )}

          {/* Info Section */}
          <View style={styles.infoSection}>
            <View style={styles.infoIcon}>
              <Ionicons name="information-circle" size={24} color={Colors.primary} />
            </View>
            <Text style={styles.infoText}>
              Notifications help you keep track of your meals and ensure nothing goes to waste. Enable notifications to
              get timely reminders about your meal inventory.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={() => router.back()}>
          <Text style={styles.saveButtonText}>Save Preferences</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerContainer: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "android" ? 40 : 20,
    paddingBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  backIcon: {
    fontSize: 28,
    color: Colors.white,
    textAlign: "center",
    lineHeight: 32,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 24,
    paddingBottom: 100, // Extra space for the button
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  mainToggleSection: {
    backgroundColor: Colors.background,
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  notificationSection: {
    backgroundColor: Colors.background,
    marginHorizontal: 24,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  toggleInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  toggleTextContainer: {
    flex: 1,
  },
  toggleTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  toggleDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E2E2",
    marginHorizontal: 16,
  },
  infoSection: {
    flexDirection: "row",
    backgroundColor: "rgba(0, 128, 0, 0.05)",
    marginHorizontal: 24,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  infoIcon: {
    marginRight: 12,
    alignSelf: "flex-start",
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  saveButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
})
