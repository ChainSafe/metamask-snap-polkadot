import {createMuiTheme} from "@material-ui/core/styles";
import {COLORS} from "../constants/colors";

export const theme = createMuiTheme({
    palette: {
        primary: {
            main: COLORS.primary
        },
        secondary: {
            main: COLORS.secondary
        },
    },
    overrides: {
        MuiPaper: {
            root: {
                backgroundColor: COLORS.regular,
            }
        },
        MuiGrid: {
            "grid-xs-12": {
                width: "100%",
            }
        }
    }
});
