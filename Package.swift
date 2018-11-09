// swift-tools-version:4.0
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "Grapher",
    products: [
        .library(
            name: "Grapher",
            type: .dynamic,
            targets: ["Grapher"]),
    ],
    dependencies: [
        // Dependencies declare other packages that this package depends on.
        // .package(url: /* package url */, from: "1.0.0"),
    ],
    targets: [
        .target(
            name: "Grapher",
            dependencies: [],
            path: "swift/Sources"),
        .testTarget(
            name: "GrapherTests",
            dependencies: ["Grapher"],
            path: "swift/Tests/GrapherTests"),
    ]
)
