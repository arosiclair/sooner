Notifications Service Design
============================

## Auth
Use identical auth as sooner-api

## Routes

### /subscription

Manage notification subscription and settings for the authenticated user

```
GET /subscription
=> {
  enabled: boolean,
  reminders: {
    enabled: boolean,
    reminderHour: number,
    reminderMinute: number
  }
}

PATCH /subscription
```

#### /subscription/devices

Add devices to notify for the authenticated user

```
POST /subscription/devices
=> [
  {
    type: "WebPush"
    pushSubscription: PushSubscription (https://developer.mozilla.org/en-US/docs/Web/API/PushSubscription)
  }
]
```