const axios = require("axios");

exports.handler = async function (event) {
  const courseCodes = ["HWYD", "OFA", "USH", "UC", "GRAWV"];
  const code = JSON.parse(event.body).code;

  if (!courseCodes.includes(code)) {
    return {
      statusCode: 404,
      body: "Course not found",
    };
  }

  const endpoint = `https://qcuialeirsxv5ht6crufymcjse0xmkop.lambda-url.us-east-1.on.aws/course/${code}`;

  const options = {
    headers: {
      "X-Accept": "application/json",
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await axios.get(endpoint, options);
    const courseData = response.data;

    return {
      statusCode: 200,
      headers: {
        "Cache-Control": "no-cache",
      },
      body: JSON.stringify({
        courseData,
      }),
    };
  } catch (error) {
    return {
      statusCode: 400,
      headers: {
        "Cache-Control": "no-cache",
      },
      body: JSON.stringify({
        error,
      }),
    };
  }
};
