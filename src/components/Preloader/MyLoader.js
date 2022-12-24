import React from "react"
import ContentLoader from "react-content-loader"

const MyLoader = (props) => (
  <ContentLoader 
    speed={2}
    width={2920}
    height={460}
    viewBox="0 0 1920 460"
    backgroundColor="#8f8f8f"
    foregroundColor="#be8383"
    {...props}
  >
    <rect x="7" y="2" rx="0" ry="0" width="110" height="38" /> 
    <rect x="142" y="4" rx="0" ry="0" width="216" height="13" /> 
    <rect x="143" y="25" rx="0" ry="0" width="220" height="13" /> 
    <rect x="5" y="73" rx="0" ry="0" width="554" height="312" /> 
    <rect x="7" y="403" rx="0" ry="0" width="550" height="37" />
  </ContentLoader>
)

export default MyLoader