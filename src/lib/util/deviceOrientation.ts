interface DeviceOrientationEventiOS extends DeviceOrientationEvent {
    requestPermission?: () => Promise<'granted' | 'denied'>
}

export const requestDeviceOrientation = () => {
    ;(
        DeviceOrientationEvent as unknown as DeviceOrientationEventiOS
    ).requestPermission?.()
}
