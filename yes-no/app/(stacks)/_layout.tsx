import {Stack} from "expo-router";

import {Role, useAuth} from "@/context/auth-context";

const StackLayout = () => {
  const {authState} = useAuth();

  return (
    <>
      <Stack>
        <Stack.Screen
          name="profile/details"
          options={{presentation: "modal", title: "Profile Details"}}
          redirect={authState?.accesstoken === null}
        />
        <Stack.Screen
          name="profile/user-image"
          options={{presentation: "modal", title: "Update Image"}}
          redirect={authState?.accesstoken === null}
        />
        <Stack.Screen
          name="profile/user-data"
          options={{presentation: "modal", title: "Update Data"}}
          redirect={authState?.accesstoken === null}
        />
        <Stack.Screen
          name="profile/user-address"
          options={{presentation: "modal", title: "Update Address"}}
          redirect={authState?.accesstoken === null}
        />
        <Stack.Screen
          name="profile/reset-password"
          options={{presentation: "modal", title: "Reset Password"}}
          redirect={authState?.accesstoken === null}
        />

        <Stack.Screen
          name="category/update/[id]"
          options={{headerShown: false}}
          redirect={authState?.role !== Role.ADMIN}
        />
        <Stack.Screen
          name="category/create"
          options={{headerShown: false}}
          redirect={authState?.role !== Role.ADMIN}
        />

        <Stack.Screen
          name="question/details/[id]"
          options={{headerShown: false}}
          redirect={authState?.accesstoken === null}
        />
        <Stack.Screen
          name="question/update/[id]"
          options={{headerShown: false}}
          redirect={authState?.role !== Role.ADMIN}
        />
        <Stack.Screen
          name="question/create"
          options={{headerShown: false}}
          redirect={authState?.role !== Role.ADMIN}
        />
      </Stack>
    </>
  );
};

export default StackLayout;
