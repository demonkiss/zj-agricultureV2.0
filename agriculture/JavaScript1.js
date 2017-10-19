SetDataInfo(new Point(mainMap.Extent.GetCenter().X, mainMap.Extent.GetCenter().Y))

function  SetDataInfo(Point center)
{
            if (xsPoints == null) xsPoints = GetPoints(xs);
if( PointInsidePolygon(xsPoints,center))
{
    this.DataInfo.Text = "数据来源:天地图•杭州•萧山";
    this.DepartmentInfo.Text = "提供单位：杭州市规划局萧山规划分局";
    this.MapInfo.Text = "";
    return true;
}

return false;
}

var  xsPoints = []; 
function   GetPoints( wkt)
{
            string[] ps = wkt.Split(',');
Point[] points = new Point[ps.Length];
for (int i = 0; i < ps.Length; i++)
{
    string[] p = ps[i].Trim().Split(' ');
    points[i] = new Point(Convert.ToDouble(p[0].Trim()), Convert.ToDouble(p[1].Trim()));
}
return points;
}


public static bool PointInsidePolygon(Point[] polygonVertices,
Point ptTest)
{
if (polygonVertices.Length < 3) /t a valid polygon
    return false;

int nCounter = 0;
int nPoints = polygonVertices.Length;

Point s1, p1, p2;
s1 = ptTest;
p1 = polygonVertices[0];

for (int i = 1; i < nPoints; i++)
{
    p2 = polygonVertices[i % nPoints];
    if (s1.Y > Math.Min(p1.Y, p2.Y))
{
        if (s1.Y <= Math.Max(p1.Y, p2.Y))
{
            if (s1.X <= Math.Max(p1.X, p2.X))
{
                if (p1.Y != p2.Y)
{
                    double xInters = (s1.Y - p1.Y) * (p2.X - p1.X) /
                        (p2.Y - p1.Y) + p1.X;
                    if ((p1.X == p2.X) || (s1.X <= xInters))
{
                        nCounter++;
}
}  //p1.y != p2.y
}
}
}
    p1 = p2;
} //for loop

if ((nCounter % 2) == 0)
    return false;
else
    return true;
}
