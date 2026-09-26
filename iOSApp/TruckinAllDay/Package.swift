// swift-tools-version: 5.7
import PackageDescription

let package = Package(
    name: "TruckinAllDay",
    platforms: [
        .iOS(.v15)
    ],
    products: [
        .library(
            name: "TruckinAllDay",
            targets: ["TruckinAllDay"]),
    ],
    dependencies: [
    ],
    targets: [
        .target(
            name: "TruckinAllDay",
            dependencies: [],
            path: "TruckinAllDay"),
        .testTarget(
            name: "TruckinAllDayTests",
            dependencies: ["TruckinAllDay"],
            path: "TruckinAllDayTests"),
    ]
)
