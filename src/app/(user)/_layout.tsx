import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';

import Colors from '@/src/constants/Colors';
import { useColorScheme } from '@/src/components/useColorScheme';
import { useClientOnlyValue } from '@/src/components/useClientOnlyValue';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, false),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Index Screen',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          // removed modal from tab one, but left code as reference
          // headerRight: () => (
          //   <Link href="/modal" asChild>
          //     <Pressable>
          //       {({ pressed }) => (
          //         <FontAwesome
          //           name="info-circle"
          //           size={25}
          //           color={Colors[colorScheme ?? 'light'].text}
          //           style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
          //         />
          //       )}
          //     </Pressable>
          //   </Link>
          // ),
          href:null,
        }}
      />     

      <Tabs.Screen 
        name="MainDashboard"
        options={{
          title: "Main Dashboard",
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          href:null,
        }}
      />

      <Tabs.Screen 
        name="RecoverPassword"
        options={{
          title: "Recover Password",
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          href:null,
        }}
      />

      <Tabs.Screen 
        name="Onboarding"
        options={{
          title: "Onboarding Screen",
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          href:null,
        }}
      />

      <Tabs.Screen 
        name="EditMeal"
        options={{
          title: "Edit Meal Screen",
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          href:null,
        }}
      />

      <Tabs.Screen 
        name="MoveMeals"
        options={{
          title: "Move Meals Screen",
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          href:null,
        }}
      />

      <Tabs.Screen 
        name="Fridge"
        options={{
          title: "Fridge Screen",
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          href:null,
        }}
      />

      <Tabs.Screen 
        name="Profile"
        options={{
          title: "Profile Screen",
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          href:null,
        }}
      />

      <Tabs.Screen 
        name="Inventory"
        options={{
          title: "Inventory Screen",
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          href:null,
        }}
      />

      <Tabs.Screen 
        name="CreateMeal"
        options={{
          title: "Create Meal Screen",
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          href:null,
        }}
      />

      <Tabs.Screen 
        name="SavedMeals"
        options={{
          title: "Saved Meals Screen",
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          href:null,
        }}
      />

      <Tabs.Screen 
        name="ConfirmMeal"
        options={{
          title: "Confirm Meal Screen",
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          href:null,
        }}
      />


      <Tabs.Screen 
        name="EditProfile"
        options={{
          title: "Edit Profile Screen",
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          href:null,
        }}
      />

      <Tabs.Screen 
        name="CreateAccount"
        options={{
          title: "Create Account",
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          href:null,
        }}
      />

      <Tabs.Screen 
        name="ManageHousehold"
        options={{
          title: "Manage Household Screen",
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          href:null,
        }}
      />
      <Tabs.Screen 
        name="MealDetails"
        options={{
          title: "Meal Details Screen",
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          href:null,
        }}
      />
      <Tabs.Screen 
        name="Gallery"
        options={{
          title: "Gallery Screen",
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          href:null,
        }}
      />
      <Tabs.Screen 
        name="RecreateMeal"
        options={{
          title: "Recreate Meal Screen",
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          href:null,
        }}
      />
    </Tabs>   
  );
}
