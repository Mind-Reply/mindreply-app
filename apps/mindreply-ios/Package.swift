// swift-tools-version: 5.10
import PackageDescription

let package = Package(
    name: "MindReplyLocal",
    platforms: [
        .iOS(.v17),
        .macOS(.v14)
    ],
    products: [
        .library(name: "MindReplyLocal", targets: ["MindReplyLocal"])
    ],
    targets: [
        .target(name: "MindReplyLocal"),
        .testTarget(name: "MindReplyLocalTests", dependencies: ["MindReplyLocal"])
    ]
)
