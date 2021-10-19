const fs = require("fs");
const csv = require("csvtojson");

if (!fs.existsSync("./output")) {
    console.log(">>>>>>>>>", "Create folder output");
    fs.mkdirSync("./output");
}

fs.readdir("./input/image", (err, filenames) => {
    filenames.forEach((file) => {
        if (file === "image.svg") return;
        fs.copyFile(`./input/image/${file}`, `./output/${file}`, function (err) {
            if (err) console.error(">>>>>", `./input/image/${file}`);
        });
    });
});

const getMembersObject = (callback) => {
    csv({ trim: true, delimiter: ";" }).fromFile("./input/members.csv").then(callback);
};

console.log(">>>>>>>>>", "Read image file");
const imageString = fs.readFileSync("./input/image/image.svg", { encoding: "utf-8" });
getMembersObject((members) => {
    let renderErrors = [];
    members.map((member) => {
        console.log(">>>>>>>>", "Render file: ", member.filename, "[Start]");
        let file = imageString;
        for (let key in member) {
            file = file.replace(`{{{${key}}}}`, member[key]);
        }
        try {
            fs.writeFileSync(`./output/${member.filename}.svg`, file);
            console.log(">>>>>>>>", "Render file: ", member.filename, "[Success]");
        } catch (error) {
            renderErrors.push(member.filename);
            console.error(">>>>>>>>", "Render file: ", member.filename, "[Error]");
        }
    });
    console.log("Render success: ", members.length - renderErrors.length);
    console.log("Render error: ", renderErrors.length);
    console.error(renderErrors);
});
