// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { describe, it } from "vitest";
import { invokingBicepCommand } from "../utils/command";

describe("bicep restore", () => {
  it("should show error message when no input file path was specified", () => {
    invokingBicepCommand("restore")
      .shouldFail()
      .withStderr(/The input file path was not specified/);
  });
});