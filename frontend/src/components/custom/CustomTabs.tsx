/**************************************************************************************************
 * This file contains the UI for the custom tabs component.                                       *
 * This component is used to create a tab panel with the provided tabs and panels.                *
 * The tabs are displayed on the left side of the panel.                                          *
 **************************************************************************************************/

import { TabPanel } from "@mui/joy";
import Tab, { tabClasses } from "@mui/joy/Tab";
import TabList from "@mui/joy/TabList";
import Tabs from "@mui/joy/Tabs";
import { SxProps } from "@mui/joy/styles/types";

/** Props of the custom tabs component. */
interface CustomTabsProps {
  tabs: { tab: string; panel: JSX.Element | null }[];
  sx?: SxProps;
}

/** UI component for a custom tabs component. */
const CustomTabs = ({ tabs, sx }: CustomTabsProps) => {
  /** UI layout for the custom tabs component. */
  return (
    <Tabs defaultValue={0} sx={sx}>
      <TabList
        tabFlex={1}
        size="sm"
        sx={{
          justifyContent: "left",
          // Override the default styles
          [`&& .${tabClasses.root}`]: {
            fontWeight: "600",
            flex: "initial",
            color: "text.tertiary",
            // Override the default styles for the selected tab
            [`&.${tabClasses.selected}`]: {
              color: "text.primary",
              borderRadius: "5px"
              
            },
          },
        }}
      >
        {/* Display each tab. */}
        {tabs.map((individualTab: { tab: string; panel: JSX.Element | null }, index: number) =>
          individualTab.panel ? (
            // Enable the tab if there is a panel.
            <Tab key={individualTab.tab} indicatorInset value={index}>
              {individualTab.tab}
            </Tab>
          ) : (
            // Disable the tab if there is no panel.
            <Tab key={individualTab.tab} indicatorInset value={index} disabled>
              {individualTab.tab}
            </Tab>
          )
        )}
      </TabList>

      {/* Display each tab panel. */}
      {tabs.map((individualTab: { tab: string; panel: JSX.Element | null }, index: number) => (
        <TabPanel key={individualTab.tab} value={index}>
          {individualTab.panel}
        </TabPanel>
      ))}
    </Tabs>
  );
};

export default CustomTabs;
